export const MessageTypes = {
  PROXY: {
    FROM_SERVER: 'proxy:from:server',
    TO_SERVER: 'proxy:to:server',
  },
  DATA: {
    TIMESTAMP: 'data:ts',
    MONEY: 'data:money',
  },
  PROTO: {
    CONNECTION: {
      STATUS: 'proto:connection:status',
    },
    WORKER: {
      START_REQ: 'worker:pro:req:start',
      START_RES: 'worker:pro:res:start',
      STOP_REQ: 'worker:pro:req:stop',
      STOP_RES: 'worker:pro:res:stop',
    },
  },
};
