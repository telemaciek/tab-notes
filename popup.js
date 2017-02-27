function notesApp() {

  singleNoteId = '123';
  singleTextareaId = 'notes-popup';

  function loadNote(noteId) {
    var noteContent;
    var localStorageNote = localStorage.getItem(noteId); // get the list data from local storage
    if (localStorageNote != null) {
      noteContent = JSON.parse(localStorageNote);
    }
    return noteContent;
  }

  function saveNote(noteId, noteContent) {
    localStorage.setItem(noteId, JSON.stringify(noteContent));
  }

  function autoSave(textareaId) {
    document.getElementById(textareaId).onkeyup = function(e){
      saveNote(singleNoteId, e.target.value)
    }
  }

  function printNote(noteId, textareaId) {
    var textarea = document.getElementById(textareaId);
    var noteContent = loadNote(noteId);
    textarea.innerHTML = noteContent;
  }
  printNote(singleNoteId, singleTextareaId);
  autoSave(singleTextareaId);

  // console.log("poprzedni url: " + document.referrer);
}
window.onload = notesApp;
