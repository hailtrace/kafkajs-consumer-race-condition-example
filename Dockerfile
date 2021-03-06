FROM node:14-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

CMD ["node", "./build/src/main.js"]