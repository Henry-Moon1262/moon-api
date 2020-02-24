FROM node:10.13.0-alpine

WORKDIR /app

COPY . .
RUN set -ex; yarn install --prod; yarn cache clean

CMD ["node", "src/index.js"]
