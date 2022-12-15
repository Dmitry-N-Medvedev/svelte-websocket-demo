FROM node:alpine3.16 AS system-setup
RUN apk update \
  && apk upgrade \
  && apk add --no-cache git bash
RUN corepack enable \
  && corepack prepare pnpm@7.18.2 --activate

FROM system-setup AS build-all
WORKDIR /repo
ADD . ./
RUN pnpm --recursive install \
  && rm -rf sources/front-end/node_modules \
  && rm -rf sources/front-end/.svelte-kit \
  && rm -rf sources/front-end/build \
  && pnpm run dockerize:front-end \
  && pnpm --filter=@dmitry-n-medvedev/svelte-websocket-demo-front-end run build

FROM node:alpine3.16 AS package-web-app
SHELL ["/bin/bash", "-c"]
ENV NODE_ENV=production
WORKDIR /app
COPY --chown=node:node --from=build-all /repo/sources/front-end/node_modules ./node_modules
COPY --chown=node:node --from=build-all /repo/sources/front-end/build .
COPY --chown=node:node --from=build-all /repo/sources/front-end/package.json .

FROM package-web-app AS run-web-app
USER node
EXPOSE 3000
CMD [ "node", "index.js" ]
