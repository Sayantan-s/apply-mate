FROM oven/bun:1 AS build
WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --ignore-scripts

COPY . .

RUN bun --bun run build:prod & \
    sleep 130 && \
    pkill -f 'node .output/server/index.mjs' || true

FROM oven/bun:1 AS production
WORKDIR /app

COPY --from=build /app/.output /app

EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "--bun", "run", "/app/server/index.mjs" ]
