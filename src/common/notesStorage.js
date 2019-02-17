export function create() {
    var json = {};
    json.version = "1.1";
    json.notes = {};
    return json;
}

export function getObj() {
    var storageString = getString();
    var storageObj = {};

    if (storageString != null) {
      storageObj = JSON.parse(storageString);
    }

    if (!Object.keys(storageObj).length) {
      storageObj = create();
    }

    if (storageObj.version === undefined) {
      storageObj = migrate(storageObj);
    }
    
    return storageObj;
}

export function getString()
{
    return localStorage.getItem("notesStorageHTML") || localStorage.getItem("notesStorage");
}

export function set(storageObj) {
    localStorage.setItem('notesStorageHTML', JSON.stringify(storageObj));
}

function migrate(oldStorageObj) {
    newStorageObj = notesStorage.create();
    var newNotesObj = newStorageObj.notes;
    for (key in oldStorageObj) {
      newNotesObj[key] = {};
      newNotesObj[key].content = oldStorageObj[key];
      newNotesObj[key].dateCreated = Date.now();
      newNotesObj[key].dateModified = Date.now();
    }
    localStorage.setItem('notesStorageHTML', JSON.stringify(newStorageObj));
    return newStorageObj;
}