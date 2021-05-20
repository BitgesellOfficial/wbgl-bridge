FROM node:buster-slim
RUN apt-get update && apt-get install -y nano

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /service

COPY . .

RUN yarn install

CMD ["node", "src/server.js"]
