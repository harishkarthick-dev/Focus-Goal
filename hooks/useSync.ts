import { useEffect } from 'react';
import { processSyncQueue } from '@/lib/sync/processor';

export function useSync() {
  useEffect(() => {
    processSyncQueue();

    const onOnline = () => {
      console.log('Online: Triggering sync...');
      processSyncQueue();
    };
    window.addEventListener('online', onOnline);

    const interval = setInterval(() => {
      processSyncQueue();
    }, 15000);

    return () => {
      window.removeEventListener('online', onOnline);
      clearInterval(interval);
    };
  }, []);
}
