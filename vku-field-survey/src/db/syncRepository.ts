import { db } from './database';

export interface SyncItem {
  id: string;
  type: 'CREATE_SURVEY';
  payload: unknown;
  createdAt: number;
}

export async function addToSyncQueue(item: SyncItem) {
  await db.put('syncQueue', item);
}

export async function getSyncQueue() {
  return db.getAll('syncQueue');
}

export async function removeSyncItem(id: string) {
  await db.delete('syncQueue', id);
}