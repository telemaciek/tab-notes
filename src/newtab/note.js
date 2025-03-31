import * as notesStorage from '../common/notesStorage.js';
import * as settingsStorage from '../common/settingsStorage.js';

function initiateNote() {
  var noteContainer = document.getElementById('js-note-container');
  var noteId = window.location.hash.substring(1) || getUniqueId();
  noteContainer.focus();
  
  function newNote() {
    var note = {};
    note.content = "";
    note.formatVersion = "1.1";
    note.dateModified = Date.now();
    note.dateCreated = Date.now();
    return note;
  }

  function getNote(noteId) {
    return notesStorage.getObj().notes[noteId] || newNote();
  }

  function saveNote(noteId, noteContent) {
    var note = getNote(noteId);
    note.content = noteContent;
    note.formatVersion = "1.1";
    note.dateModified = Date.now();
    setNotes(noteId, note);
  }

  function setNotes(noteId, note) {
    var storageObj = notesStorage.getObj();
    storageObj.notes[noteId] = note;
    notesStorage.set(storageObj)
  }

  function showNote(noteId) {
    var note = getNote(noteId);
    noteContainer.innerHTML = note.content;
  }
  
  function startAutosaving() {

    var debouncedSave = debounce(function (e) {
      e.preventDefault();

      // Save sanitized html with selected tags available for new lines and simple formatting
      var noteText = sanitizeHtml(
        e.target.innerHTML, 
        { allowedTags: ["strong", "b", "i", "div", "em", "br"], allowedAttributes: {} });

      // Display sanitized title and amount of text
      saveNote(noteId, noteText);
      setDocumentTitle(noteText);
      setProperFavicon(noteText.length);
    }, 250);

    noteContainer.addEventListener("input", debouncedSave)
  }

  function setDocumentTitle(contentHtml) {
    // sanitize a greater portion of the content than the desired title substring 
    //  length to avoid incomplete html elements, e.g., "&lt;", left unsanitized
    var content = sanitizeHtml(contentHtml.substring(0, 40), { allowedTags: [], allowedAttributes: {} }).substring(0, 20);

    switch (true) {
      case (content === ""):
      case (content === "\n"):
      case (content === "<br>"):
        document.title = "Note";
        break;
      case (content != ""):
        document.title = content;
        break;
    }
  }

  function changeFavicon(state) {
    var link = document.querySelector("link[rel*='icon']");
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = 'favicon/' + state + '.png';
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  function setProperFavicon(noteTextLength) {
    if (noteTextLength === 0) {
        changeFavicon('empty');
    } else if (noteTextLength < 20) {
      changeFavicon('1line');
    } else if (noteTextLength < 150) {
      changeFavicon('2lines');
    } else if (noteTextLength < 450) {
      changeFavicon('3lines');
    } else if (noteTextLength < 650) {
      changeFavicon('4lines');
    } else if (noteTextLength < 800) {
      changeFavicon('5lines');
    } else {
      changeFavicon('full');
    }
  }

  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this, args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  function setTheme()
  {
    var cachedSettingsObj = settingsStorage.getObj();
    var noteContainer = document.getElementById("js-note-container");

    if (cachedSettingsObj.darkMode)
    {
      noteContainer.classList.add("theme-dark")
    }

    window.addEventListener('storage', function(e) {  
      if (e.key == "settingsStorage")
      {
          var updatedSettingsObj = settingsStorage.getObj();

          if (updatedSettingsObj.darkMode && !cachedSettingsObj.darkMode) {
            noteContainer.classList.add("theme-dark");
          }
          else if (!updatedSettingsObj.darkMode && cachedSettingsObj.darkMode) {
            noteContainer.classList.remove("theme-dark");
          }

          cachedSettingsObj = updatedSettingsObj;
      }
    });
  }

  function getUniqueId() {
    var date = new Date();
    return date.getTime();
  }

  setTheme();
  showNote(noteId);

  setDocumentTitle(noteContainer.innerHTML);
  setProperFavicon(noteContainer.innerHTML.length);

  // Launch autosaving... also start changing title and favicon
  startAutosaving();
}

window.addEventListener('load', initiateNote);
