FROM node:8

# Create app directory
WORKDIR /lime

# Bundle app source
COPY . .

# Install app dependencies
RUN npm install -g npm@latest && npm install
