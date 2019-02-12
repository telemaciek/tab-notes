function initiateNote() {
  var noteContainer = document.getElementById('js-note-container');
  var noteId = window.location.hash.substring(1);

  noteContainer.focus();

  function newStorageObj() {
    var json = {};
    json.version = "1";
    json.notes = {};
    return json;
  }

  function migrate(oldStorageObj) {
    newStorageObj = newStorageObj();
    var newNotesObj = newStorageObj.notes;
    for (key in oldStorageObj) {
      newNotesObj[key] = {};
      newNotesObj[key].content = oldStorageObj[key];
      newNotesObj[key].dateCreated = Date.now();
      newNotesObj[key].dateModified = Date.now();
    }
    localStorage.setItem('notesStorage', JSON.stringify(newStorageObj));
    return newStorageObj;
  }

  function getNotes() {
    
    var storageString = localStorage.getItem("notesStorageHTML");

    if (!storageString) {
      storageString = localStorage.getItem("notesStorage");
    }

    var storageObj = {};
    if (storageString != null) {
      storageObj = JSON.parse(storageString);
    }

    if (!Object.keys(storageObj).length) {
      storageObj = newStorageObj();
    }
    if (storageObj.version === undefined) {
      storageObj = migrate(storageObj);
    }

    return storageObj.notes || {};
  }

  function newNote(noteId) {
    var note = {};
    note.content = "";
    note.dateModified = Date.now();
    note.dateCreated = Date.now();
    return note;
  }

  function getNote(noteId) {
    var notesObj = getNotes();
    note = notesObj[noteId] || newNote(noteId);
    return note;
  }

  function saveNote(noteId, noteContent) {
    var note = getNote(noteId);
    note.content = noteContent;
    note.formatVersion = "1.1";
    note.dateModified = Date.now();
    setNotes(noteId, note);
  }

  function setNotes(noteId, note) {
    var notesObj = getNotes();
    notesObj[noteId] = note;
    var storageObj = {}
    storageObj.version = "1.1";
    storageObj.notes = notesObj;
    localStorage.setItem('notesStorageHTML', JSON.stringify(storageObj));
  }

  function showNote(noteId) {
    var note = getNote(noteId);
    noteContainer.innerHTML = note.content;
  }
  
  function startAutosaving() {

    saveDebounce = debounce(function (e) {
      e.preventDefault();

      // Save sanitized html with selected tags available for new lines and simple formatting
      // var noteText = e.target.innerHTML;
      var noteText = sanitizeHtml(e.target.innerHTML, { allowedTags: ["strong", "b", "i", "div", "em", "br"], allowedAttributes: {} });

      // Display sanitized title and amount of text
      // var sanitizedTitle = noteText.substring(0, 20);
      var sanitizedTitle = sanitizeHtml(noteText.substring(0, 20), { allowedTags: [], allowedAttributes: {} });

      saveNote(noteId, noteText);
      setDocumentTitle(sanitizedTitle);
      setProperFavicon(noteText.length);
    }, 250);

    noteContainer.addEventListener("input", saveDebounce)
  }

  function setDocumentTitle(content) {
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

  // Set it up for the first time
  showNote(noteId);
  var initialHTML = sanitizeHtml(noteContainer.innerHTML.substring(0, 20), { allowedTags: [], allowedAttributes: {} });
  setDocumentTitle(initialHTML);
  setProperFavicon(initialHTML.length);

  // Launch autosaving... also start changing title and favicon
  startAutosaving();
}
window.addEventListener('load', initiateNote);