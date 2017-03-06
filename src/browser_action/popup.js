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
      console.log(note + key);
      x += "<a href='/newtab/note.html#" + key + "'>";
      x += "<div class='note'>" + note + "</div>";
      x += "</a>";
    }
    console.log(x);

    notesContainer.innerHTML = x;
  }
  listNotes();
}

window.onload = initiatePopup;
