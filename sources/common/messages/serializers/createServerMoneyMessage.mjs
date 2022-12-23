import {
  MessageTypes,
} from '../../MessageTypes.mjs';

const encoder = new TextEncoder();

export const createServerMoneyMessage = (wallet = 0.0, delta = 0.0) => {
  const messageObject = Object.freeze({
    type: MessageTypes.MONEY,
    payload: {
      wallet,
      delta,
    },
  });
  const messageString = JSON.stringify(messageObject);

  return encoder.encode(messageString);
};
