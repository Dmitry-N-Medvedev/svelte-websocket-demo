import {
  writable,
} from 'svelte/store';

const STORE = [];

const createTsStore = () => {
  const {
    subscribe,
    update,
  } = writable(STORE);

  return {
    subscribe,
    updateFromServer: (ts = null) => update((currentState) => {
      if (ts === null) {
        throw new ReferenceError('ts is undefined');
      }

      currentState.push(ts);
      return currentState;
    }),
  }
};

export const TsStore = createTsStore();
