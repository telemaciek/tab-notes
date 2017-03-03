function openNoteTab() {
  function getUniqueId() {
    var date = new Date();
    return date.getTime();
  }
  var nextLink = document.getElementById('nextLink');
  if (window.history.length != 1) {
    nextLink.href = 'javaScript:void(0);';
  } else {
    nextLink.href = "note.html#" + getUniqueId();

    // Those if's are needed in case Chrome crashes
    // Without them, extension would prevent user from restoring opened tabs
    chrome.windows.getAll(function(windows) {
      // console.log(windows[0].id)
      if (windows[0].id === 1 && windows.length === 1) { // tab id & window opened
        chrome.tabs.getAllInWindow(function(window) {
          if (window.length === 1) { // tabs in window
            nextLink.href = 'javaScript:void(0);';
            // console.log('CRASH? So sorry...')
          } else {
            // console.log('Let\'s initiate the note...')
            nextLink.click();
          }
        });
      } else {
        // console.log('Let\'s initiate the note...')
        nextLink.click();
      }
    });

  }
}
window.onload = openNoteTab;
