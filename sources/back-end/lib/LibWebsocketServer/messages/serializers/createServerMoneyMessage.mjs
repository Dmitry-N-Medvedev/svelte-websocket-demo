import {
  MessageTypes,
} from './MessageTypes.mjs';

const encoder = new TextEncoder();

export const createServerMoneyMessage = () => {
  const messageObject = Object.freeze({
    type: MessageTypes.MONEY,
    payload: (Math.random() * 10),
  });
  const messageJSON = JSON.stringify(messageObject);

  return encoder.encode(messageJSON);
};
