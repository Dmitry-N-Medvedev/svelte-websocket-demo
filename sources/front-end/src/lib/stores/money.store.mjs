import {
  writable,
} from 'svelte/store';

const STORE = {
  sum: 0,
  delta: 0,
};

const createMoneyStore = () => {
  const {
    subscribe,
    update,
  } = writable(STORE);

  return {
    subscribe,
    updateMoneyFromServer: (money = 0) => update((currentState) => {
      if (money === 0) {
        return currentState;
      }

      currentState.sum += money;
      currentState.delta = money;

      return currentState;
    }),
  }
};

export const MoneyStore = createMoneyStore();
