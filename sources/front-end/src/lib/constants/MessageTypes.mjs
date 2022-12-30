export const MessageTypes = {
  PROXY: {
    FROM_SERVER: 'proxy:from:server',
    TO_SERVER_REQ: 'proxy:to-server:req',
    TO_SERVER_RAW: 'proxy:to-server:raw',
  },
  DATA: {
    TIMESTAMP: 'data:ts',
    MONEY: 'data:money',
    DONATE: 'data:donate',
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
