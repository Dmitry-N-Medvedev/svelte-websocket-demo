import {
  MessageTypes,
} from './MessageTypes.mjs';

const encoder = new TextEncoder();

export const createServerMoneyMessage = (money) => {
  const messageObject = Object.freeze({
    type: MessageTypes.MONEY,
    payload: money || (Math.random() * 10),
  });
  const messageString = JSON.stringify(messageObject);

  console.log('createServerMoneyMessage', messageString);

  return encoder.encode(messageString);
};
