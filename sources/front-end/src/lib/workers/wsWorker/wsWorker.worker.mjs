import {
  MessageTypes,
} from '$lib/constants/MessageTypes.mjs';
import {
  WSClient,
} from '$lib/modules/ws/index.mjs';
import {
  EdgeProxy,
} from '$lib/modules/EdgeProxy/EdgeProxy.mjs';

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const startedMessage = Object.freeze(encoder.encode(JSON.stringify({
  type: MessageTypes.PROTO.WORKER.START_RES,
  payload: {
    name: self.name,
  }
})).buffer);
const stoppedMessage = Object.freeze(encoder.encode(JSON.stringify({
  type: MessageTypes.PROTO.WORKER.STOP_RES,
  payload: {
    name: self.name,
  }
})).buffer);
let wsClient = null;
let edgeProxy = null;

self.onerror = (errorEvent) => {
  console.error({ errorEvent });
}

self.onmessage = (messageEvent) => {
  const {
    data,
  } = messageEvent;
  const stringifiedData = decoder.decode(data);
  const dataObject = JSON.parse(stringifiedData);
  const {
    type,
    payload,
  } = dataObject;

  switch(type) {
    case MessageTypes.PROTO.WORKER.START_REQ: {
      edgeProxy = new EdgeProxy();
      edgeProxy.start();

      wsClient = new WSClient(payload.url);
      wsClient.start();

      console.log(`${self.name} ${type}ing w/ payload:`, payload);

      self.postMessage(startedMessage, [ startedMessage ]);

      break;
    }
    case MessageTypes.PROTO.WORKER.STOP_REQ: {
      console.log(`${self.name} should ${type}`);

      wsClient.stop();
      wsClient = undefined;

      edgeProxy.stop();
      edgeProxy = undefined;

      self.postMessage(stoppedMessage, [ stoppedMessage ]);

      break;
    }
    default: {
      throw new TypeError('unknown message type:', messageEvent);
    }
  }
}


