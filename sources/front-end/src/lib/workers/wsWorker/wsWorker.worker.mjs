import {
  WorkerProtocolMessages,
} from '$lib/workers/WorkerProtocolMessages.mjs';
import {
  WSClient,
} from '$lib/modules/ws/index.mjs';

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const startedMessage = Object.freeze(encoder.encode(JSON.stringify({
  type: WorkerProtocolMessages.STARTed,
  payload: {
    name: self.name,
  }
})).buffer);
const stoppedMessage = Object.freeze(encoder.encode(JSON.stringify({
  type: WorkerProtocolMessages.STOPped,
  payload: {
    name: self.name,
  }
})).buffer);
let wsClient = null;

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
    case WorkerProtocolMessages.START: {
      wsClient = new WSClient(payload.url);
      wsClient.start();

      console.log(`${self.name} ${type}ing w/ payload:`, payload);

      self.postMessage(startedMessage, [ startedMessage ]);

      break;
    }
    case WorkerProtocolMessages.STOP: {
      console.log(`${self.name} should ${type}`);

      wsClient.stop();
      wsClient = null;

      self.postMessage(stoppedMessage, [ stoppedMessage ]);

      break;
    }
    default: {
      throw new TypeError('unknown message type:', messageEvent);
    }
  }
}


