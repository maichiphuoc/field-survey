import { openDB } from 'idb';

export const db = await openDB('vku-field-survey', 1, {
  upgrade(database) {
    if (!database.objectStoreNames.contains('surveys')) {
      database.createObjectStore('surveys', {
        keyPath: 'id',
      });
    }

    if (!database.objectStoreNames.contains('syncQueue')) {
      database.createObjectStore('syncQueue', {
        keyPath: 'id',
      });
    }
  },
});