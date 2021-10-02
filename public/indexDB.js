let db;
const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;


const request = indexedDB.open("budget", 1);

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};

request.onerror =(err) => {
    console.log(err.message);
};

request.onsuccess = (event) => {
    db = event.target.result;
    console.log("on success" + db)
    if(navigator.onLine) {
        checkDatabase();
    }
};

// This is called from index.js
// When user creates a transaction while offline
const saveRecord = (record) =>{
    console.log("in indexedDB.js / saveRecord ---------------------" + record , db);
    const transaction = db.transaction(["pending"], "readwrite");
    console.log("in indexedDB.js / saveRecord / transaction ----------------" + transaction);
    const store = transaction.objectStore("pending");
    store.add(record);

};

const checkDatabase = () => {
    const transaction = db.transaction(["pending"],"readwrite");
    console.log("in indexedDB.js / checkDatabase / transaction ----------------" + transaction);
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = () => {
        if(getAll.result.length > 0) {
            fetch("/api/transaction/bulk",{
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["pending"],"readwrite");
                const store = transaction.objectStore("pending");
                store.clear();
            });
        }
    };
}
// event listener for when app comes back online
window.addEventListener("online",checkDatabase);