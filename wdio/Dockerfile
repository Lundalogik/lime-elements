FROM node:10-alpine

RUN apk --no-cache add \
    ffmpeg

RUN npm config set unsafe-perm true

RUN npm install -g npm@latest \
    @wdio/cli@^5.6.4 \
    @wdio/local-runner@^5.6.4 \
    @wdio/mocha-framework@^5.6.4 \
    @wdio/spec-reporter@^5.6.4 \
    @wdio/sync@^5.6.4 \
    chai@^4.2.0 \
    uuid@^3.3.2 \
    wdio-screen-commands@^1.0.0 \
    webdriverio@^5.6.4

# Clean up obsolete files:
RUN rm -rf \
    /tmp/* \
    /root/.npm

# Set NODE_PATH to be able to require globally installed packages:
ENV NODE_PATH=/usr/lib/node_modules

WORKDIR /home/wdio

COPY bin/wait-for.sh /usr/local/bin/wait-for

ENTRYPOINT ["wait-for", "--", "wdio"]
