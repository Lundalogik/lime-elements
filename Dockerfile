FROM node:8

# Create app directory
WORKDIR /lime

# See https://crbug.com/795759
RUN apt-get update && apt-get install -yq libgconf-2-4

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb

# Uncomment to skip the chromium download when installing puppeteer. If you do,
# you'll need to launch puppeteer with:
#     browser.launch({executablePath: 'google-chrome-unstable'})
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# .npmrc sets the correct registry for `npm install` to use
COPY .npmrc ./

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json
# are copied where available (npm@5+)
COPY package*.json ./

RUN npm install -g npm@latest

# Add user so we don't need --no-sandbox.
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /lime

# Run npm install as pptruser so we don't have to chown node_modules later
USER pptruser
RUN npm install

# Everything we copy will be owned by root, and will have to be chown:ed
# after copy. For that we need to be admin, so we switch back to root here.
USER root

# Bundle app source
COPY . .

# chown everything to be owned by pptruser, except for the node_modules
# folder (already done), and the .git folder (unnecessary)
RUN find . \( -path ./.git -o -path ./node_modules \) -prune -o -exec chown pptruser:pptruser {} \;

# From here on out, everything will be run as pptruser.
USER pptruser
