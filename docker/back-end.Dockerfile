FROM node:19.3.0-bullseye-slim AS system-setup
RUN apt-get --assume-yes update \
    && apt-get --assume-yes upgrade \
    && apt-get --no-install-recommends --assume-yes install apt-transport-https ca-certificates \
    && update-ca-certificates \
    && apt-get --no-install-recommends --assume-yes install git \
    && apt-get --assume-yes autoclean \
    && apt-get --assume-yes autoremove \
    && corepack enable \
    && corepack prepare pnpm@7.21.0 --activate

FROM system-setup AS build-all
WORKDIR /repo
ADD . ./
RUN pnpm --recursive install \
    && pnpm run dockerize:back-end

FROM node:19.3.0-bullseye-slim AS package-server
SHELL ["/bin/bash", "-c"]
ENV NODE_ENV=production
WORKDIR /app
COPY --chown=node:node --from=build-all /repo/sources/back-end/srv/WebsocketServer .

FROM package-server AS run-server
USER node
EXPOSE 9090
CMD [ "./server.mjs" ]
