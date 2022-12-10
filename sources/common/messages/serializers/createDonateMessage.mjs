import {
  MessageTypes,
} from '../../MessageTypes.mjs';

const encoder = new TextEncoder();

export const createDonateMessage = (money) => {
  const messageObject = Object.freeze({
    type: MessageTypes.DONATE,
    payload: money || (Math.random() * 10),
  });
  const messageString = JSON.stringify(messageObject);

  return encoder.encode(messageString);
};
