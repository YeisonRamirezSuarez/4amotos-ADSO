import { writable } from 'svelte/store';
import { isPocketbaseAlive, pocketbaseBaseUrl } from '$lib/utils/pocketbase';

export type PocketbaseStatus = 'checking' | 'up' | 'down';
export const pbHost = pocketbaseBaseUrl.replace(/^https?:\/\//, '');

type StoreShape = { subscribe: ReturnType<typeof writable<PocketbaseStatus>>['subscribe'] };

const createStore = (): StoreShape => {
  const { subscribe, set } = writable<PocketbaseStatus>(typeof window === 'undefined' ? 'checking' : 'down');

  let pollId: ReturnType<typeof setInterval> | null = null;
  let inFlight = false;

  const check = async () => {
    if (typeof window === 'undefined' || inFlight) return;
    inFlight = true;
    set('checking');
    const fallback = setTimeout(() => set('down'), 6000);

    try {
      const alive = await isPocketbaseAlive();
      set(alive ? 'up' : 'down');
    } catch (err) {
      set('down');
    } finally {
      clearTimeout(fallback);
      inFlight = false;
    }
  };

  if (typeof window !== 'undefined') {
    check();
    pollId = setInterval(check, 12000);
  }

  return {
    subscribe,
  };
};

const globalKey = '__pbStatusStore__';
const globalObj = typeof globalThis !== 'undefined' ? (globalThis as Record<string, unknown>) : {};

export const pbStatusStore: StoreShape =
  (globalObj[globalKey] as StoreShape | undefined) || (globalObj[globalKey] = createStore());
