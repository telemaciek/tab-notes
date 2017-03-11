function initiatePopup() {
  function selectText() {
    document.getElementById('specials').select();
  }
  // selectText();

  function exportJson() {
    var exportJsonLink = document.getElementById('exportJsonLink');
    var notesJsonString = localStorage.getItem("notesStorage");
    var data = new Blob([notesJsonString], {type: 'text/json'});
    function downloadExport() {
      var dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(notesJsonString);
      var timeOfSave = new Date();
      exportJsonLink.download = "tab-notes-backup-" + timeOfSave.getTime() + ".json";
      exportJsonLink.href = dataUri;
    }
    exportJsonLink.addEventListener('click', downloadExport);
  }
  exportJson();

  function listNotes() {
    var notesJsonString = localStorage.getItem("notesStorage");
    var notesJson = JSON.parse(notesJsonString);
    var notesContainer = document.getElementById("notesList");

    var x = "";

    for (key in notesJson) {
      note = notesJson[key];
      var noteSize;
      if (note.length === 0) {
        noteSize = "Empty"
      } else {
        noteSize = note.length + " characters"
      }
      // console.log(note + key);
      x += "<div class='note-container'>"
        + "<a href='/newtab/note.html#" + key + "' target='" + key + "' class='note'>"
        + "<div class='note-content'>"
        + note
        + "</div>"
        + "<div class='note-extra'>"
        + noteSize
        + "</div>"
        + "</a>"
        + "<div class='note-actions'>"
        + "<div class='note-pin'>"
        + "✨"
        + "</div>"
        + "<div class='note-delete js-note-delete' data-note-id='" + key + "'>"
        + "<svg width='10px' height='10px' viewBox='0 0 10 10'><g><path d='M5,3.82352941 L1.17647059,1.5720758e-13 L6.61692923e-14,1.17647059 L3.82352941,5 L4.4408921e-13,8.82352941 L1.17647059,10 L5,6.17647059 L8.82352941,10 L10,8.82352941 L6.17647059,5 L10,1.17647059 L8.82352941,1.5720758e-13 L5,3.82352941 Z' fill='#555555'></path></g></svg>"
        + "</div>"
        + "</div>"
        + "</div>";
    }

    notesContainer.innerHTML = x;
    bindDelete();
  }
  listNotes();
  window.addEventListener("focus", listNotes); // Redraw notes every time you get back

  function bindDelete() {
    var deleteButtons = document.getElementsByClassName('js-note-delete');
    for (var i=0; i < deleteButtons.length; i++) {
      console.log('x');
      deleteButtons[i].addEventListener('click', deleteNote);
    };
  }
  function deleteNote() {
    var notesJsonString = localStorage.getItem("notesStorage");
    var notesJson = JSON.parse(notesJsonString);
    var noteId = this.getAttribute('data-note-id');
    delete notesJson[noteId];
    localStorage.setItem('notesStorage', JSON.stringify(notesJson));
    listNotes();
  }

}

window.onload = initiatePopup;
