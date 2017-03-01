function initiateNote() {
  var noteContainer = document.getElementById('note-container');
  var noteId = window.location.hash.substring(1);

  function loadNote(noteId) {
    var noteContent;
    var localStorageNote = localStorage.getItem(noteId);
    if (localStorageNote != null) {
      noteContent = JSON.parse(localStorageNote);
    }
    return noteContent;
  }

  function showNote(noteId) {
    var noteContent = loadNote(noteId);
    if (noteContent != undefined) {
      noteContainer.innerHTML = noteContent;
    }
  }

  function saveNote(noteId, noteContent) {
    localStorage.setItem(noteId, JSON.stringify(noteContent));
  }

  function startAutosaving() {
    noteContainer.onkeyup = function(e) {
      saveNote(noteId, e.target.value)
    }
  }

  showNote(noteId);
  startAutosaving(); // Launch autosaving
}
window.addEventListener('load', initiateNote);
