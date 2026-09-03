import {
  getSyncQueue,
  removeSyncItem,
} from '../db/syncRepository';

import { uploadSurvey } from './api';

export async function syncPendingSurveys() {
  const queue = await getSyncQueue();

  for (const item of queue) {
    try {
      await uploadSurvey(item.payload);

      await removeSyncItem(item.id);

      console.log(
        `Synced: ${item.id}`
      );

    } catch (error) {
      console.error(
        `Sync failed: ${item.id}`,
        error
      );

      break;
    }
  }
}