function openNoteTab() {
  function getUniqueId() {
    var date = new Date();
    return date.getTime();
  }
  var nextLink = document.getElementById('nextLink');
  if (window.history.length === 1) {
    nextLink.href = "note.html#" + getUniqueId();
    nextLink.click();
  } else {
    nextLink.href = 'javaScript:void(0);';
  }
}
window.onload = openNoteTab;
