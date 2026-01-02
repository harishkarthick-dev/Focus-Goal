import { dbPromise } from '@/lib/offline/db';
import { addToSyncQueue } from '@/lib/sync/queue';
import { Task, Goal, Note } from '@/types';

export async function performLocalAction<T>(
  storeName: 'tasks' | 'goals' | 'notes',
  entity: T & { id: string },
  actionType: 'CREATE' | 'UPDATE',
  syncEntityType: 'TASK' | 'GOAL' | 'NOTE'
) {
  const db = await dbPromise;
  if (!db) return;

  await db.put(storeName, entity as unknown as Task & Goal & Note);

  await addToSyncQueue({
    type: actionType,
    entity: syncEntityType,
    entityId: entity.id,
    payload: entity,
  });
}

export async function performLocalDelete(
  storeName: 'tasks' | 'goals' | 'notes',
  id: string,
  syncEntityType: 'TASK' | 'GOAL' | 'NOTE'
) {
  const db = await dbPromise;
  if (!db) return;

  await db.delete(storeName, id);

  await addToSyncQueue({
    type: 'DELETE',
    entity: syncEntityType,
    entityId: id,
    payload: {},
  });
}
