FROM node:17

WORKDIR /app

COPY package.json .

RUN npm install

COPY src .

EXPOSE 8080

CMD [ "node", "index.js" ]