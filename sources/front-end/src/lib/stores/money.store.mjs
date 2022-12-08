import {
  writable,
} from 'svelte/store';

const STORE = [];

const createMoneyStore = () => {
  const {
    subscribe,
    update,
  } = writable(STORE);

  return {
    subscribe,
    updateMoneyFromServer: (money = 0) => update((currentState) => {
      console.log('updateMoneyFromServer', currentState);

      if (money === 0) {
        return currentState;
      }

      currentState.push(money);
      return currentState;
    }),
  }
};

export const MoneyStore = createMoneyStore();
