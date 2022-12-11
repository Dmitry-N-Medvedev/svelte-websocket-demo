import {
  writable,
} from 'svelte/store';

const STORE = false;

const createWsOnlineStatusStore = () => {
  const {
    subscribe,
    update,
  } = writable(STORE);

  return {
    subscribe,
    updateOnlineStatus: (isOnline = false) => update((currentState) => {
      currentState = isOnline;

      return currentState;
    }),
  }
};

export const WSOnlineStatusStore = createWsOnlineStatusStore();
