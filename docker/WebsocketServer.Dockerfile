FROM node:19.2.0 AS system-setup
RUN corepack enable \
  && corepack prepare pnpm@7.18.1 --activate

FROM system-setup AS build-all
WORKDIR /sources
ADD . ./
RUN pnpm install

FROM build-all AS run-server
WORKDIR /sources/sources/back-end/srv/WebsocketServer
EXPOSE 9090
CMD [ "pnpm", "run", "dev:server" ]
