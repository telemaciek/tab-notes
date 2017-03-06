function initiatePopup() {
  function selectText() {
    document.getElementById('specials').select();
  }
  selectText();

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
      // console.log(note + key);
      x += "<div class='note-container'><a href='/newtab/note.html#" + key + "' target='" + key + "'>";
      x += "" + note + "";
      x += "</a><span class='note-delete js-note-delete' data-note-id='" + key + "'>DELETE</span></div>";
    }

    notesContainer.innerHTML = x;
    bindDelete();
  }
  listNotes();

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
