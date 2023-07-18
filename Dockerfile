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

# ### STAGE 2: Run ###
FROM node:14.21.3 AS server-build
WORKDIR /root/
COPY --from=build /usr/src/app/dist/sunbird-collection-editor/ ./dist/sunbird-collection-editor/
COPY package*.json ./
RUN npm install
COPY server.js latexService.js .env .
EXPOSE 3000
CMD ["node", "server.js"]


# ### STAGE 2: Run ###
# FROM nginx:alpine
# # COPY nginx.conf /etc/nginx/nginx.conf
# COPY --from=build /usr/src/app/dist/sunbird-collection-editor/ /usr/share/nginx/html
# EXPOSE 80
# # CMD ["npm", "start"]
