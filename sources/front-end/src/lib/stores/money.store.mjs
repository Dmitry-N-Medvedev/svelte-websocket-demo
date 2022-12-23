import {
  writable,
} from 'svelte/store';

const STORE = {
  wallet: 0.0,
  delta: 0.0,
};

const createMoneyStore = () => {
  const {
    subscribe,
    update,
  } = writable(STORE);

  return {
    subscribe,
    updateMoneyFromServer: ({ userId = null, wallet = 0.0, delta = 0.0 }) => update((currentState) => {
      currentState.wallet = wallet;
      currentState.delta = delta;

      return currentState;
    }),
  }
};

export const MoneyStore = createMoneyStore();
