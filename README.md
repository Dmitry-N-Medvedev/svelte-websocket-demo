# svelte-websocket-demo

## prerequisites

1. node 19.3.0
2. pnpm 7.20.0

`NB`: I use [volta](https://volta.sh/) to manage node and pnpm versions.

`NB`: Please also ditch using npm altogether, do use [pnpm](https://pnpm.io/) for god's sake.

Install node using volta:

```bash
volta install node@19.3.0
```

Install pnpm using volta:

```bash
volta install pnpm@7.20.0
```

Go to the root of the repository and run the following command:

```bash
pnpm --recursive install
```

Now you are ready to run the app.

## how to run it in dev mode

1. open two consoles ( one for the front-end and one for the back-end )
2. in the front-end console navigate to the [front-end](sources/front-end) directory
3. in the back-end console navigate to the [back-end/srv/WebsocketServer](sources/back-end/srv/WebsocketServer) directory
4. in the front-end console type `pnpm run dev`
5. in the back-end console type `pnpm run dev:server`

## parts

1. [front-end](sources/front-end/README.md)
2. [back-end](sources/back-end/readme.md)
3. [common](sources/common/readme.md)

## dockerization

`NB`: please run the following commands from the root directory of this monorepo

### build the ws-front-end image

```bash
./docker/.scripts/dockerize-front-end
```

### build the ws-back-end image

```bash
./docker/.scripts/dockerize-back-end
```

### run containers

```bash
./docker/bin/run-front-end
```

```bash
./docker/bin/run-back-end
```

now, open your web browser at http://localhost:3000/ to see how the front-end looks like.
