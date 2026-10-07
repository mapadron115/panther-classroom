import type { RecordItem } from '../lib/classroom-storage';

const DATABASE = 'panther-classroom-v1';
let connection: Promise<IDBDatabase> | undefined;
function database() {
  if (!connection) connection = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('records', { keyPath: 'id' });
      request.result.createObjectStore('files', { keyPath: 'id' });
    };
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => { db.close(); connection = undefined; };
      resolve(db);
    };
    request.onerror = () => { connection = undefined; reject(new Error('Browser storage is unavailable. Enable site storage and retry.')); };
    request.onblocked = () => { connection = undefined; reject(new Error('Close other classroom tabs, then retry.')); };
  });
  return connection;
}
async function transaction<T>(store: string, mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const request = operation(tx.objectStore(store));
    tx.oncomplete = () => resolve(request.result);
    tx.onabort = () => reject(new Error(tx.error?.name === 'QuotaExceededError' ? 'Browser storage is full. Remove unused site data or choose a smaller file.' : 'Could not save in this browser. Your input is preserved; please retry.'));
    tx.onerror = () => { /* onabort reports the failed transaction */ };
  });
}
export async function listRecords(): Promise<RecordItem[]> {
  return transaction('records', 'readonly', store => store.getAll());
}
export async function saveRecord(kind: string, id: string, data: Record<string, unknown>) {
  if (!['submission', 'message', 'discussion', 'event', 'profile', 'completed', 'read'].includes(kind) || id.length > 150 || JSON.stringify(data).length > 120000) throw new Error('Invalid saved activity.');
  const row = { ...data, id, kind };
  await transaction('records', 'readwrite', store => store.put(row));
  return row;
}
export async function removeEvent(id: string) {
  if (!/^event-[a-f0-9-]{36}$/.test(id)) throw new Error('Invalid calendar event.');
  await transaction('records', 'readwrite', store => store.delete(id));
}
export async function uploadFile(file: File) {
  if (file.size > 10 * 1024 * 1024) throw new Error('Choose a file smaller than 10 MB.');
  const id = crypto.randomUUID();
  await transaction('files', 'readwrite', store => store.put({ id, name: file.name, blob: file }));
  return { id, name: file.name, size: file.size };
}
export async function downloadAttachment(id: string, name: string) {
  const saved = await transaction<{ id: string; name: string; blob: Blob } | undefined>('files', 'readonly', store => store.get(id));
  if (!saved) throw new Error('This attachment is unavailable in this browser.');
  const url = URL.createObjectURL(saved.blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name || saved.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
