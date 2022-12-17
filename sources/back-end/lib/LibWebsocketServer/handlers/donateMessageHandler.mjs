import {
  createServerMoneyMessage,
} from '@dmitry-n-medvedev/common/messages/serializers/createServerMoneyMessage.mjs';

export const donateMessageHandler = (ws = null, messageObject = null, clients = null, debuglog = () => {}) => {
  const isBinary = true;

  if (ws === null) {
    throw new ReferenceError('ws is undefined');
  }

  if (messageObject === null) {
    throw new ReferenceError('messageObject is undefined');
  }

  if (clients === null) {
    throw new ReferenceError('clients is undefined');
  }

  const clientDonateSum = 0 - messageObject.payload;
  debuglog(`${ws.id} => ${clientDonateSum} [${typeof clientDonateSum}]`);

  const numOfOtherClients = clients.size - 1;
  debuglog({ numOfOtherClients });

  const donateMessage = createServerMoneyMessage(clientDonateSum);
  const donationToOthersMessage = createServerMoneyMessage(messageObject.payload / numOfOtherClients);

  for (const client of clients.values()) {
    if (client.id !== ws.id) {
      debuglog(`${client.id} !== ${ws.id}`, client.id !== ws.id);

      client.send(donationToOthersMessage, isBinary);
    }
  }

  ws.send(donateMessage, isBinary);
};
