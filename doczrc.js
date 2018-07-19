import fs from 'fs';
import path from 'path';
import http from 'http';

const port = 3000;

/**
 * Extend the listen method on http.Server in order to serve 
 * static files from the filesystem that the dev-server
 * does not handle
 */
http.Server.prototype.listen = extendListen(http.Server.prototype.listen);
function extendListen(listen) {
    return function (...args) {
        if (args[0] === port) {
            this.on('request', handleRequest);
        }

        return listen.apply(this, args);
    }
}

/**
 * Serve files from the filesystem if the URL starts with '/stencil'
 * 
 * @param {*} req 
 * @param {*} res 
 */
function handleRequest(req, res) {
    if (!req.url.includes('/stencil/www')) {
        return;
    }

    const filename = req.url.replace('/stencil', '');
    const filepath = path.join(__dirname, filename);

    if (!fs.existsSync(filepath)) {
        return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/javascript');
    const data = fs.readFileSync(filepath);
    res.end(data);
}

/**
 * Docz config
 */
export default {
    description: 'Documentation for Lime elements',
    typescript: true,
    indexHtml: 'src/index.html',
    port: port,
    themeConfig: {
        colors: {
            primary: '#00b3a7'
        }
    }
}