function initiateNote() {
  var noteContainer = document.getElementById('note-container');
  var noteId = window.location.hash.substring(1);

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
    var storageString = localStorage.getItem("notesStorage");
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
    note.dateModified = Date.now();
    setNotes(noteId, note);
  }

  function setNotes(noteId, note) {
    var notesObj = getNotes();
    notesObj[noteId] = note;
    var storageObj = {}
    storageObj.version = "1";
    storageObj.notes = notesObj;
    localStorage.setItem('notesStorage', JSON.stringify(storageObj));
  }

  function showNote(noteId) {
    var note = getNote(noteId);
    noteContainer.innerHTML = note.content;
  }

  function startAutosaving() {
    noteContainer.onkeyup = function(e) {
      var noteText = e.target.value;
      saveNote(noteId, noteText);
      setDocumentTitle(noteText);
      setProperFavicon(noteText.length);
    }
  }

  function setDocumentTitle(content) {
    var newlineIndex = content.indexOf("\n");
    switch (true) {
      case (content === ""):
      case (content === "\n"):
      case (content === "\n\n"):
      case (content === "\n\n\n"):
        document.title = "Note";
        break;
      case (newlineIndex <= 0):
        document.title = content.substring(0,20);
        break;
      case (newlineIndex <= 20):
        document.title = content.substring(0,newlineIndex);
        break;
      case (content.length > 20):
        document.title = content.substring(0,20) + "...";
        break;
      case (newlineIndex > 20):
        document.title = content.substring(0,20) + "...";
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

  showNote(noteId);
  setDocumentTitle(noteContainer.value);
  setProperFavicon(noteContainer.value.length);
  startAutosaving(); // Launch autosaving... also start changing title and favicon

}
window.addEventListener('load', initiateNote);
