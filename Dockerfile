FROM node:8-alpine
WORKDIR /app
COPY index.js .
COPY ./config ./config
COPY package.json .
COPY ./lib ./lib
RUN npm install
CMD npm start
