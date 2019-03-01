const shell = require('shelljs');
const fs = require('fs');
const distDir = 'docsDist';

setup();
build();
run();

function setup() {
    shell.rm('-rf', distDir);
    shell.mkdir(distDir);
    shell.cd(distDir);

    if (shell.mkdir('lime-elements').code !== 0) {
        shell.echo(`mkdir ${distDir}/lime-elements failed!`);
        shell.cd('..');
        teardown();
        shell.exit(1);
    }

    shell.cd('..');
}

function build() {
    // dev-build required for the readme.md for
    // each component to be created. /Ads
    if (shell.exec('npm run dev').code !== 0) {
        shell.echo('dev failed!');
        teardown();
        shell.exit(1);
    }

    if (shell.exec('npm run docz:build').code !== 0) {
        shell.echo('docz:build failed!');
        teardown();
        shell.exit(1);
    }

    if (
        shell.cp('-R', '.docz/dist/*', `${distDir}/lime-elements/`).code !== 0
    ) {
        shell.echo('copying output failed!');
        teardown();
        shell.exit(1);
    }

    const indexHtml = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>title</title>
        <link rel="stylesheet" href="style.css">
        <script>
            window.top.location.href = "/lime-elements";
        </script>
      </head>
      <body></body>
    </html>
    `;

    fs.writeFile(`${distDir}/index.html`, indexHtml, 'utf8', () =>
        console.log('index.html created!')
    );
}

function teardown() {
    console.log('Error...');
}

function run() {
    const StaticServer = require('static-server');
    const server = new StaticServer({
        rootPath: distDir,
        port: 1337,
    });

    server.start(function() {
        console.log('Server listening to', server.port);
    });
}
