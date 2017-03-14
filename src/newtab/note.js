function initiateNote() {
  var noteContainer = document.getElementById('note-container');
  var noteId = window.location.hash.substring(1);

  function loadNote(noteId) {
    var noteContent = "";
    var notesJsonString = localStorage.getItem("notesStorage");
    if (notesJsonString != null) {
      notesJson = JSON.parse(notesJsonString);
      noteContent = notesJson[noteId];
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
    var notesJsonString = localStorage.getItem("notesStorage");
    var notesJson = {};
    if (notesJsonString != null) {
      notesJson = JSON.parse(notesJsonString);
    }
    notesJson[noteId] = noteContent;
    localStorage.setItem('notesStorage', JSON.stringify(notesJson));
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
    console.log("Character count: " + noteTextLength);
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
