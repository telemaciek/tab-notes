import * as notesStorage from '../common/notesStorage.js';
import * as settingsStorage from '../common/settingsStorage.js';

function initiatePopup() {
 
  var getDate = function(time, style){
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var timeNow = new Date();
    if (style != "absolute" && timeNow.getDay() === time.getDay() && time.getMonth() === timeNow.getMonth() && time.getFullYear() === timeNow.getFullYear()) {
      return "Today at " + ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2);
    } else {
      return time.getDate() + " " + months[time.getMonth()] + " " + time.getFullYear() + " at " + ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2);
    }
  }

  var exportJsonLink = document.getElementById('exportJsonLink');
  exportJsonLink.addEventListener('click', () => {
    var dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(notesStorage.getString());
    var timeOfSave = getDate(new Date(), "absolute");
    exportJsonLink.download = "tab-notes-backup (" + timeOfSave + ").json";
    exportJsonLink.href = dataUri;
  });

  var notesStorageObj = notesStorage.getObj();
  var settingsStorageObj = settingsStorage.getObj();

  function setTheme(darkMode)
  {
    var popupPage = document.getElementById('popupPage');

    if (darkMode)
    {
      popupPage.classList.add("theme-dark");
    }
    else {
      popupPage.classList.remove("theme-dark");
    }
    
    document.getElementById("theme-icon-dark").style.display = darkMode ? "inline" : "none";
    document.getElementById("theme-icon-light").style.display = darkMode ? "none" : "inline";
  }
  setTheme(settingsStorageObj.darkMode);

  var toggleThemeLink = document.getElementById('toggleThemeLink');
  toggleThemeLink.addEventListener('click', () => {
    settingsStorageObj.darkMode = !settingsStorageObj.darkMode;
    settingsStorage.set(settingsStorageObj);
    setTheme(settingsStorageObj.darkMode);
  });

  var getNotes = function(){
    // use cached notes object to avoid serialization hit on each filter call
    return notesStorageObj.notes;
  }

  var sortNotes = function(){
    var notesObj = getNotes();
    var notesArray = Object.keys(notesObj).map(function (key) { notesObj[key].id = key; return notesObj[key]; });
    var sortedNotesArray = notesArray.sort(function(a, b){ return a.dateModified - b.dateModified }).reverse()
    return sortedNotesArray;
  }

  var filterNotes = function(searchTerm){
    var notesArr = sortNotes();
    var options = {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        "content"
      ]
    };
    var fuse = new Fuse(notesArr, options); // "list" is the item array
    var result = fuse.search(searchTerm);

    if (searchTerm) {
      return result;
    } else {
      return notesArr;
    }
  }
  var search = function(){
    var searchInput = document.querySelector('#searchInput');
    searchInput.focus();
    searchInput.addEventListener('keyup', function(){
      listNotes(searchInput.value)
    });
  }
  search();

  function listNotes(searchTerm) {
    if (searchTerm) {
      var notesArr = filterNotes(searchTerm);
    } else {
      var notesArr = sortNotes();
    }


    var notesContainer = document.getElementById("notesList");
    var noteElement = "";
    for (var i = 0; i < notesArr.length; i++) {
      var note = notesArr[i];
      var noteSize;

      var fakeDomElement = document.createElement("div");
      fakeDomElement.innerHTML = note.content;
      var noteContent = fakeDomElement.textContent || fakeDomElement.innerText;

      if (noteContent.length === 0) {
        noteSize = "Empty"
      } else {
        noteSize = noteContent.length + " characters"
      }
      noteElement += "<div class='note-container'>"
        + "<a href='/newtab/note.html#" + note.id + "' target='" + note.id + "' class='note'>"
        + "<div class='note-content'>"
        + noteContent.slice(0,100)
        + "</div>"
        + "<div class='note-extra'>"
        + getDate(new Date(note.dateModified))
        // + "<span class='note-size'>"
        // + noteSize
        // + "</span>"
        + "</div>"
        + "</a>"
        + "<div class='note-actions'>"
        + "<div class='note-pin'>"
        + "✨"
        + "</div>"
        + "<div class='note-delete js-note-delete' data-note-id='" + note.id + "'>"
        + "<svg width='10px' height='10px' viewBox='0 0 10 10'><g><path d='M5,3.82352941 L1.17647059,1.5720758e-13 L6.61692923e-14,1.17647059 L3.82352941,5 L4.4408921e-13,8.82352941 L1.17647059,10 L5,6.17647059 L8.82352941,10 L10,8.82352941 L6.17647059,5 L10,1.17647059 L8.82352941,1.5720758e-13 L5,3.82352941 Z' fill='#555555'></path></g></svg>"
        + "</div>"
        + "</div>"
        + "</div>";
    }

    notesContainer.innerHTML = noteElement;
    bindDelete();
  }
  listNotes("");
  window.addEventListener("focus", listNotes()); // Redraw notes every time you get back

  function bindDelete() {
    var deleteButtons = document.getElementsByClassName('js-note-delete');
    for (var i=0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener('click', deleteNote);
    };
  }

  function deleteNote() {
    // refresh cached object to avoid lost deletes if deletes are performed across more than one popup instance
    notesStorageObj = notesStorage.getObj();
    var notesObj = notesStorageObj.notes;
    var noteId = this.getAttribute('data-note-id');
    delete notesObj[noteId];
    notesStorageObj.notes = notesObj;
    notesStorage.set(notesStorageObj);
    listNotes();
  }
}

window.onload = initiatePopup;
