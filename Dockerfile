### STAGE 1: Build ###
FROM node:14.21.3 AS build
RUN apt-get update
RUN apt-get install -y python3
RUN mkdir -p /usr/src/app 
WORKDIR /usr/src/app
RUN npm install -g @angular/cli@15.2.9
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build-lib:prod
RUN npm run build
EXPOSE 3000
CMD ["node", "server.js"]
