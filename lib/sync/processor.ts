import { dbPromise } from '@/lib/offline/db';
import { db as firestore } from '@/lib/firebase/client';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { SyncOperation } from '@/types';

export async function processSyncQueue() {
  const db = await dbPromise;
  if (!db) return;
  if (!navigator.onLine) return;

  const queue = await db.getAllFromIndex('syncQueue', 'by-timestamp');
  if (queue.length === 0) return;

  console.log(`Sync: Processing ${queue.length} operations...`);

  for (const op of queue) {
    try {
      await processOperation(op);
      await db.delete('syncQueue', op.id);
    } catch (error) {
      console.error('Sync failed for op:', op.id, error);
    }
  }
}

async function processOperation(op: SyncOperation) {
  const collectionMap = {
    TASK: 'tasks',
    GOAL: 'goals',
    NOTE: 'notes',
  };

  const collectionName = collectionMap[op.entity];
  if (!collectionName) return;

  const ref = doc(firestore, collectionName, op.entityId);

  if (op.type === 'DELETE') {
    await deleteDoc(ref);
  } else {
    const sanitizedPayload = JSON.parse(
      JSON.stringify(op.payload, (key, value) => {
        return value === undefined ? null : value;
      })
    );
    await setDoc(ref, sanitizedPayload, { merge: true });
  }
}
