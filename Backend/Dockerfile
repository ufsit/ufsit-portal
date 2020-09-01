FROM node:alpine

RUN mkdir -p /app/server
WORKDIR /app/server

COPY package*.json /app/server/

RUN npm install
COPY . /app/server/

EXPOSE 1337

CMD ["node", "server.js"]