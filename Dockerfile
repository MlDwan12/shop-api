FROM node:18-alpine
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json ./
RUN yarn install --frozen-lockfile

COPY tsconfig.json ./
COPY knexfile.ts ./
COPY src ./src
COPY migrations ./migrations
COPY seeds ./seeds

RUN mkdir -p dist/src/docs && \
    cp src/docs/openapi.yaml dist/src/docs/

RUN yarn build

CMD ["sh", "-c", "yarn knex migrate:latest && yarn knex seed:run && node dist/src/server.js"]