import {
  MessageTypes,
} from '../../MessageTypes.mjs';

const encoder = new TextEncoder();

export const createServerTSMessage = () => {
  const messageObject = Object.freeze({
    type: MessageTypes.TS,
    payload: Date.now(),
  });
  const messageJSON = JSON.stringify(messageObject);

  return encoder.encode(messageJSON);
};
