FROM node:alpine

RUN mkdir -p /server
WORKDIR /server

COPY package*.json /server/

RUN npm install
COPY . /server/

EXPOSE 1337

CMD ["node", "server.js"]