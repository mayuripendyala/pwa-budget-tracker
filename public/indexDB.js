const indexDB =
    window.indexedDB ||
    window.mozIndexDB ||
    window.webkitIndexDB ||
    window.msIndexDB ||
    window.shimIndexDB;

let db;
const request = indexDB.open("budget",1);

request.onupgradeneeded = (event) => {
    event.target.result.createObjectStore("pending", {
        keyPath: "id",
        autoincrement: true
    });
};

request.onerror =(err) => {
    console.log(err.message);
};

request.onsuccess = (event) => {
    db = event.target.result;

    if(navigator.onLine) {
        checkDatabase();
    }
};

// This is called from index.js
// When user creates a transaction while offline
const saveRecord = (record) =>{
    const transaction = db.transaction("pending", "readwrite");
    const store = transaction.objectStore("pending");
    store.add(record);

};

const checkDatabase = () => {
    const transaction = db.transaction("pending","readonly");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = () => {
        if(getAll.result.length > 0) {
            fetch("/api/transactions/bulk",{
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then((response) => response.json())
            .then(() => {
                const transaction = db.transaction("pending","readwrite");
                const store = transaction.objectStore("pending");
                store.clear();
            });
        }
    };
}

window.addEventListener("online",checkDatabase);