export function create() {
    var json = {};
    json.darkMode = false;
    return json;
}

export function getObj()
{
    var storageString = getString();
    var storageObj = {};

    if (storageString != null) {
        storageObj = JSON.parse(storageString);
    }

    if (!Object.keys(storageObj).length) {
        storageObj = create();
    }

    return storageObj;
}

export function getString()
{
    return localStorage.getItem("settingsStorage");
}

export function set(storageObj) {
    localStorage.setItem('settingsStorage', JSON.stringify(storageObj));
}