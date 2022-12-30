import {
  MessageTypes,
} from '$lib/constants/MessageTypes.mjs';
import {
  dev as InDevMode,
} from '$app/environment';

export class Ldr {
  /** @type {Map} */
  #workers = null;
  /** @type {TextEncoder} */
  #encoder = null;
  /** @type {TextDecoder} */
  #decoder = null;
  #startMessage = null;
  #stopMessage = null;
  #workersConfig = null;

  constructor(workersConfig = null) {
    if (workersConfig === null || Object.keys(workersConfig).length === 0) {
      throw new ReferenceError('workersConfig is undefined');
    }

    this.#workersConfig = Object.assign(Object.create(null), workersConfig);

    this.#encoder = new TextEncoder();
    this.#decoder = new TextDecoder();
    this.#workers = new Map();

    this.#stopMessage = Object.freeze(this.#encoder.encode(JSON.stringify({
      type: MessageTypes.PROTO.WORKER.STOP_REQ,
      payload: {},
    })).buffer);
  }

  async #loadServiceWorker() {
    
    if ('serviceWorker' in navigator) {
      try {
        self.addEventListener('load', () => {
          console.log('#loadServiceWorker', 'serviceWorker' in navigator);

          navigator
            .serviceWorker
            .register(new URL('$lib/service-worker/index.mjs', import.meta.ur), {
              type: InDevMode ? 'module': 'module',
            })
            .then((registrationResult) => {
              console.log({ registrationResult });
            })
            .catch((registrationError) => {
              console.error({ registrationError });
            });
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  async #loadWSClientWebWorker() {
    this.#workers.set('wsWorker', new Worker(new URL('$lib/workers/wsWorker/wsWorker.worker.mjs', import.meta.url), {
      type: 'module',
      credentials: 'include',
      name: 'wsWorker',
    }));
  }

  #handleWorkerMessage({ data }) {
    const {
      type,
      payload,
    } = JSON.parse(this.#decoder.decode(data))

    switch(type) {
      case MessageTypes.PROTO.WORKER.START_RES: {
        console.log(`${payload.name} has ${type}`);

        break;
      }
      case MessageTypes.PROTO.WORKER.STOP_RES: {
        console.log(`${payload.name} has ${type}`);

        this.#workers.get(payload.name).removeEventListener('message', this.#handleWorkerMessage.bind(this));
        this.#workers.get(payload.name).terminate();
        this.#workers.delete(payload.name);

        if (this.#workers.size === 0) {
          console.log('all workers have been unloaded');
        }

        break;
      }
      default: {
        throw new TypeError('unknown message type:', type, payload);
      }
    }
  }
  
  async #startWorkers() {
    for await (const [workerName, worker] of this.#workers) {
      const startMessage = Object.freeze(this.#encoder.encode(JSON.stringify({
        type: MessageTypes.PROTO.WORKER.START_REQ,
        payload: this.#workersConfig[workerName],
      })).buffer);
      
      worker.addEventListener('message', this.#handleWorkerMessage.bind(this));
      worker.postMessage(startMessage, [ startMessage ]);

      console.log(`requested ${workerName} to ${MessageTypes.PROTO.WORKER.START_REQ}`);
    }
  }

  async #stopWorkers() {
    for await (const [workerName, worker] of this.#workers) {
      worker.postMessage(this.#stopMessage);

      console.log(`requested ${workerName} to ${MessageTypes.PROTO.WORKER.STOP_REQ}`);
    }
  }

  async start() {
    // await this.#loadServiceWorker();
    await this.#loadWSClientWebWorker();

    await this.#startWorkers();
  }

  async stop() {
    await this.#stopWorkers();
  }
}
