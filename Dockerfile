FROM node:lts-stretch

# Create app directory
WORKDIR /lime

RUN npm install -g npm@latest

# Bundle app source
COPY . .

RUN npm install

RUN node ./postinstall.js

RUN npm run docz:serve -- --noServe
