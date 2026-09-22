FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY mock-api ./mock-api

EXPOSE 6023

CMD ["node", "mock-api/demo-server.js"]