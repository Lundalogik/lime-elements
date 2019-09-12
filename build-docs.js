const shell = require('shelljs');

build();

function build() {
    // Run dev-build so Stencil generates its doc-files.
    if (shell.exec('npm run dev').code !== 0) {
        shell.echo('npm run dev failed!');
        shell.exit(1);
    }

    // Clean up the output of the dev-build, as we don't need it.
    shell.rm('-rf', '.docz/public');

    // Run the docz-build.
    if (shell.exec('npx docz build').code !== 0) {
        shell.echo('npx docz build failed!');
        shell.exit(1);
    }

    // Now run the "real" Stencil build.
    if (
        shell.exec(
            'cross-env-shell NODE_ENV=prod SASS_PATH=node_modules "stencil build --docs --config stencil.config.docs.ts"'
        ).code !== 0
    ) {
        shell.echo('stencil build failed!');
        shell.exit(1);
    }
}
