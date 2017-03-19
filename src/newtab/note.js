function initiateNote() {
  var noteContainer = document.getElementById('note-container');
  var noteId = window.location.hash.substring(1);

  function newStorageObj() {
    // Return initial json (could have example notes)
    var json = {};
    json.notes = {};
    json.version = "1";
    return json;
  }

  function migrate() {
    // if version
    // if version != 1, migrate
    // notes.noteId.key = notes.key
    // notes.noteId.value = notes.value
    // notes.noteId.created = now
    // version = 1
    // set in localStorage
    // return json.notes
  }

  function getNotes() {
    // get data from localStorage
    var storageString = localStorage.getItem("notesStorage");

    // change string into object
    var storageObj = {};
    if (storageString != null) {
      storageObj = JSON.parse(storageString);
    }

    // if version doesn't match...
    if (storageObj.version != "1") {
      // ...run migration from old version or...
      // TO DO: ...create a new storageObj
      // TO DO: should I save new object after migration?
      // TO DO: maybe change this into a switch?
      storageObj = newStorageObj();
    }

    // return notes object or empty object
    return storageObj.notes || {};
  }
  console.log(getNotes());

  function newNote(noteId) {
    var note = {};
    note.content = "";
    note.dateModified = Date.now();
    note.dateCreated = Date.now();
    return note;
  }

  function getNote(noteId) {
    // get json.notes (getNotes)
    var notesObj = getNotes();
    // get noteId value
    note = notesObj[noteId] || newNote(noteId);
    return note;
  }

  function saveNote(noteId, noteContent) {
    // get note (getNote)
    var note = getNote(noteId);
    // change noteContent & date modified
    note.content = noteContent;
    note.dateModified = Date.now();
    // save note into localStorage
    setNotes(noteId, note);
  }

  function setNotes(noteId, note) {
    // get object from Localstorage,
    var notesObj = getNotes();
    // change note in notes object
    notesObj[noteId] = note;
    // construct storage object
    var storageObj = {}
    storageObj.version = "1";
    storageObj.notes = notesObj;
    // change to string & save into localStorage
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
    // console.log("Character count: " + noteTextLength);
    switch (true) {
      case (noteTextLength === 0):
        changeFavicon('empty');
        break;
      case (noteTextLength < 20):
        changeFavicon('1line');
        break;
      case (noteTextLength < 150):
        changeFavicon('2lines');
        break;
      case (noteTextLength < 450):
        changeFavicon('3lines');
        break;
      case (noteTextLength < 650):
        changeFavicon('4lines');
        break;
      case (noteTextLength < 800):
        changeFavicon('5lines');
        break;
      default:
        changeFavicon('full');
        break;
    }
  }

  showNote(noteId);
  setDocumentTitle(noteContainer.value);
  setProperFavicon(noteContainer.value.length);
  startAutosaving(); // Launch autosaving... also start changing title and favicon

}
window.addEventListener('load', initiateNote);
