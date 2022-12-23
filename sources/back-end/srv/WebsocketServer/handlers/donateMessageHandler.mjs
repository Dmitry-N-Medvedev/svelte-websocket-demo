export const donateMessageHandler = (libDB = null, clientId = null, messageObject = null, clients = null, debuglog = () => {}) => {
  if (libDB === null) {
    throw new ReferenceError('libDB is undefined');
  }

  // this.#libDB.addSum(clientId, sum);

  if (clientId === null) {
    throw new ReferenceError('clientId is undefined');
  }

  if (messageObject === null) {
    throw new ReferenceError('messageObject is undefined');
  }

  if (clients === null) {
    throw new ReferenceError('clients is undefined');
  }

  const clientDonateSum = 0 - messageObject.payload;
  const numOfOtherClients = clients.size - 1;

  debuglog(`.donateMessageHandler: ${clientId} donates ${clientDonateSum}`, { numOfOtherClients });

  debuglog('\n\n');
  for (const client of clients.values()) {
    if (client.id !== clientId) {
      debuglog(`.donateMessageHandler::THEM ${messageObject.payload / numOfOtherClients}`);

      libDB.addSum(client.id, (messageObject.payload / numOfOtherClients));
    } else {
      debuglog(`.donateMessageHandler::ME ${clientDonateSum}`);

      libDB.addSum(clientId, clientDonateSum);
    }
  }
  debuglog('\n\n');
};
