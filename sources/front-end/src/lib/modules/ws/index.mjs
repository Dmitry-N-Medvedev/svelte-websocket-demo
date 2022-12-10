const decoder = new TextDecoder();
const encoder = new TextEncoder();
const broadcastChannels = Object.freeze({
  ts: new BroadcastChannel('ts'),
  money: new BroadcastChannel('money'),
  toServer: new BroadcastChannel('to-server'),
});

export class WSClient {
  /** @type {WebSocket} */
  #client = null;
  #url = null;

  constructor(url = null) {
    if (url === null) {
      throw new ReferenceError('url is undefined');
    }

    this.#url = url;
    // this.#handleOutgoingMessage.bind(this);
  }

  async #handleMessage(messageEvent = null) {
    if (messageEvent === null) {
      throw new ReferenceError('messageEvent is undefined');
    }

    const messageObject = JSON.parse(decoder.decode(await messageEvent.data.arrayBuffer()));

    (broadcastChannels[messageObject.type])?.postMessage(messageObject);
  };

  async #handleOutgoingMessage(/** @type {MessageEvent} */ messageEvent) {
    const messageObject = Object.assign({}, await messageEvent.data);
    const messageBinary = encoder.encode(JSON.stringify(messageObject));

    this.#client.send(messageBinary);
  }
  
  start() {
    this.#client = new WebSocket(this.#url);
    this.#client.addEventListener('message', this.#handleMessage);
    broadcastChannels.toServer.addEventListener('message', this.#handleOutgoingMessage.bind(this));
  }

  stop() {
    if (this.#client) {
      this.#client.close();
      this.#client.removeEventListener('message', this.#handleMessage);
    }

    for (const broadcastChannel of Object.values()) {
      broadcastChannel.close();
    }

    this.#client = null;
  }
}