FROM node:buster-slim
RUN apt-get update && apt-get install -y nano
RUN npm install pm2 -g

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /service

COPY . .

CMD ["sh", "-c", "yarn ; pm2-runtime src/server.js"]
