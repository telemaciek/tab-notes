function initiatePopup() {

  if (window.location.hash.substring(1) == 'default') {
    document.getElementById('popupPage').className = 'default';
  }

  function selectText() {
    document.getElementById('specials').select();
  }
  // selectText();

  var getDate = function(time, style){
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var timeNow = new Date();
    if (style != "absolute" && timeNow.getDay() === time.getDay() && time.getMonth() === timeNow.getMonth() && time.getFullYear() === timeNow.getFullYear()) {
      return "Today at " + ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2);
    } else {
      absoluteDate = time.getDate() + " " + months[time.getMonth()] + " " + time.getFullYear() + " at " + ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2);
      return absoluteDate;
    }
  }

  function exportJson() {
    var exportJsonLink = document.getElementById('exportJsonLink');
    var notesJsonString = localStorage.getItem("notesStorage");
    var data = new Blob([notesJsonString], {type: 'text/json'});
    function downloadExport() {
      var dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(notesJsonString);
      var timeOfSave = getDate(new Date(), "absolute");
      exportJsonLink.download = "tab-notes-backup (" + timeOfSave + ").json";
      exportJsonLink.href = dataUri;
    }
    exportJsonLink.addEventListener('click', downloadExport);
  }
  exportJson();

  var getNotes = function(){
    var storageString = localStorage.getItem("notesStorage");
    var storageObj = JSON.parse(storageString);
    return storageObj.notes;
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
      threshold: 0.6,
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
    console.log(result);

    if (searchTerm) {
      return result;
    } else {
      return notesArr;
    }
  }

  function listNotes() {
    var sortedNotesArray = filterNotes("");
    var notesContainer = document.getElementById("notesList");
    var noteElement = "";
    for (var i = 0; i < sortedNotesArray.length; i++) {
      note = sortedNotesArray[i];
      var noteSize;
      if (note.content.length === 0) {
        noteSize = "Empty"
      } else {
        noteSize = note.content.length + " characters"
      }
      noteElement += "<div class='note-container'>"
        + "<a href='/newtab/note.html#" + note.id + "' target='" + note.id + "' class='note'>"
        + "<div class='note-content'>"
        + note.content.slice(0,100)
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
  listNotes();
  window.addEventListener("focus", listNotes); // Redraw notes every time you get back

  function bindDelete() {
    var deleteButtons = document.getElementsByClassName('js-note-delete');
    for (var i=0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener('click', deleteNote);
    };
  }
  function deleteNote() {
    var storageString = localStorage.getItem("notesStorage");
    var storageObj = JSON.parse(storageString);
    notesObj = storageObj.notes;
    var noteId = this.getAttribute('data-note-id');
    delete notesObj[noteId];
    storageObj.notes = notesObj;
    localStorage.setItem('notesStorage', JSON.stringify(storageObj));
    listNotes();
  }
}

window.onload = initiatePopup;
