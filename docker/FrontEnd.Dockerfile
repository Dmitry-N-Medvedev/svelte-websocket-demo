FROM node:alpine3.16 AS system-setup
RUN apk update && apk upgrade && \
    apk add --no-cache git
RUN corepack enable \
  && corepack prepare pnpm@7.18.1 --activate

FROM system-setup AS build
WORKDIR /sources
ADD . ./
RUN pnpm install && pnpm --recursive run build
# RUN pnpm --filter=@dmitry-n-medvedev/websocketserver --prod deploy ./out/WebsocketServer

FROM build AS deployFrontEnd
WORKDIR /app
# ENV NODE_ENV=production
COPY --from=build /sources/sources/front-end/build .
COPY --from=build /sources/sources/front-end/package.json .
RUN rm -rf /sources

EXPOSE 3000
CMD [ "node", "index.js" ]
