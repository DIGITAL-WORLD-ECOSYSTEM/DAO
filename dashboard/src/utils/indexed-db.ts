/**
 * Native IndexedDB Wrapper for Chat Offline Queue
 * Enterprise Grade - Zero external dependencies
 */

const DB_NAME = 'AsppibraChatOfflineDB';
const DB_VERSION = 1;

export const STORE_NAMES = {
  PENDING_MESSAGES: 'pending_messages',
  PENDING_ATTACHMENTS: 'pending_attachments',
  FAILED_MESSAGES: 'failed_messages',
  METADATA: 'metadata',
} as const;

export class ChatOfflineDB {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.initDB();
  }

  private initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        // Fallback for SSR or unsupported environments
        console.warn('IndexedDB not supported in this environment');
        resolve();
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORE_NAMES.PENDING_MESSAGES)) {
          db.createObjectStore(STORE_NAMES.PENDING_MESSAGES, { keyPath: 'tempId' });
        }
        if (!db.objectStoreNames.contains(STORE_NAMES.PENDING_ATTACHMENTS)) {
          db.createObjectStore(STORE_NAMES.PENDING_ATTACHMENTS, { keyPath: 'attachmentId' });
        }
        if (!db.objectStoreNames.contains(STORE_NAMES.FAILED_MESSAGES)) {
          db.createObjectStore(STORE_NAMES.FAILED_MESSAGES, { keyPath: 'tempId' });
        }
        if (!db.objectStoreNames.contains(STORE_NAMES.METADATA)) {
          db.createObjectStore(STORE_NAMES.METADATA, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event) => {
        console.error('IndexedDB init error:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  async ensureDB() {
    if (!this.db && this.initPromise) {
      await this.initPromise;
    }
  }

  async put(storeName: string, value: any): Promise<void> {
    await this.ensureDB();
    if (!this.db) return;

    await new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(value);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(storeName: string, key: string | number): Promise<T | null> {
    await this.ensureDB();
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    await this.ensureDB();
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, key: string | number): Promise<void> {
    await this.ensureDB();
    if (!this.db) return;

    await new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: string): Promise<void> {
    await this.ensureDB();
    if (!this.db) return;

    await new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Export singleton instance
export const chatDB = new ChatOfflineDB();
