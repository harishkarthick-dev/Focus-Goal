import { dbPromise } from '@/lib/offline/db';
import { SyncOperation } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const addToSyncQueue = async (
  op: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount'>
) => {
  const db = await dbPromise;
  if (!db) return;

  const fullOp: SyncOperation = {
    ...op,
    id: uuidv4(),
    timestamp: Date.now(),
    retryCount: 0,
  };

  await db.put('syncQueue', fullOp);
  console.log('Queued sync op:', fullOp.type, fullOp.entity);
};
