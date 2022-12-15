FROM node:19.3.0-bullseye-slim AS system-setup
RUN corepack enable \
  && corepack prepare pnpm@7.18.2 --activate

FROM system-setup AS build-all
WORKDIR /repo
ADD . ./
RUN pnpm --recursive --prod install
RUN pnpm run dockerize:back-end

FROM node:19.3.0 AS package-server
SHELL ["/bin/bash", "-c"]
ENV NODE_ENV=production
WORKDIR /app
COPY --chown=node:node --from=build-all /repo/sources/back-end/srv/WebsocketServer .

FROM package-server AS run-server
USER node
EXPOSE 9090
CMD [ "./server.mjs" ]
