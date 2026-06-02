// Minimal static file server for the built `www/` docs, used by the example
// tests. The docs are a single-page app with hash-based routing, so every route
// loads the same `/index.html` and no SPA fallback is needed — assets are served
// as-is and unknown paths return 404.
const http = require('node:http');
const sirv = require('sirv');

const port = Number(process.argv[2] || 3333);
const serve = sirv('www', { dev: true, single: false });

http.createServer((request, response) =>
    serve(request, response, () => {
        response.statusCode = 404;
        response.end('Not found');
    })
).listen(port, () => {
    console.log(`Serving www/ on http://localhost:${port}`);
});
