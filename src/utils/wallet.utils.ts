  // Open or create the IndexedDB database
export const db = await new Promise<IDBDatabase>((resolve, reject) => {
  const request = window.indexedDB.open("walletsDB", 1);

  request.onerror = () => reject(request.error);
  request.onsuccess = () => resolve(request.result);

  request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    const db = (event.target as IDBOpenDBRequest).result;
    db.createObjectStore("wallets", { keyPath: "id" });
  };
});

