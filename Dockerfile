FROM node:20 AS build
WORKDIR /app

# Install dependencies needed to build native addons
RUN apt-get update && apt-get install -y python3 make build-essential

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:20-slim AS production
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY --from=build /app/.output ./.output

EXPOSE 3000/tcp
ENTRYPOINT [ "node", ".output/server/index.mjs" ]
