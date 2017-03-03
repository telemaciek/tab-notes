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
}

window.onload = initiatePopup;
