import {
  MessageTypes,
} from '../../MessageTypes.mjs';

export const createWsOnlineStatusMessage = (isOnline = false) => {
  const messageObject = Object.freeze({
    type: MessageTypes.ONLINE_STATUS,
    payload: isOnline,
  });

  return messageObject;
};
