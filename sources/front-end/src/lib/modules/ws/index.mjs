const decoder = new TextDecoder();
const broadcastChannels = Object.freeze({
  ts: new BroadcastChannel('ts'),
  money: new BroadcastChannel('money'),
});

export class WSClient {
  #client = null;
  #url = null;

  constructor(url = null) {
    if (url === null) {
      throw new ReferenceError('url is undefined');
    }

    this.#url = url;
  }

  async #handleMessage(messageEvent = null) {
    if (messageEvent === null) {
      throw new ReferenceError('messageEvent is undefined');
    }

    const messageObject = JSON.parse(decoder.decode(await messageEvent.data.arrayBuffer()));

    (broadcastChannels[messageObject.type])?.postMessage(messageObject);
  };
  
  start() {
    this.#client = new WebSocket(this.#url);
    this.#client.addEventListener('message', this.#handleMessage);
  }

  stop() {
    if (this.#client) {
      this.#client.close();
    }

    for (const broadcastChannel of Object.values()) {
      broadcastChannel.close();
    }

    this.#client = null;
  }
}