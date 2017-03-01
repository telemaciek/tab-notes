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
      saveNote(noteId, e.target.value);
      setDocumentTitle(e.target.value);
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
      case (newlineIndex > 20):
        document.title = content.substring(0,20) + "...";
        break;
    }
  }

  showNote(noteId);
  setDocumentTitle(noteContainer.value);
  startAutosaving(); // Launch autosaving
}
window.addEventListener('load', initiateNote);
