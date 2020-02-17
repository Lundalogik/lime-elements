const shell = require('shelljs');
const fs = require('fs');
const replace = require('replace-in-file');
const argv = require('yargs').argv;

const version = argv.v || '0.0.0-dev';

const pruneDev = argv.pruneDev !== undefined;
const removeSpecific = !!argv.remove;

const runSetup = argv.noSetup === undefined;
const runBuild = argv.noBuild === undefined;
const runCommit = argv.noCommit === undefined;
const runPush = argv.noPush === undefined;
const runPublish = argv.noPublish === undefined;
const runTeardown = argv.noTeardown === undefined;

const cleanOnFail = runTeardown && argv.noCleanOnFail === undefined;
const dryRun = !!argv.dryRun && argv.dryRun !== 'false';

if (argv.h !== undefined) {
    shell.echo(`
usage: npm run docz:publish [-- [--v=<version>] [--remove=<pattern>] [--pruneDev]
                                [--noSetup] [--noBuild] [--noCommit] [--noPush]
                                [--noTeardown] [--dryRun] [--noCleanOnFail]]

    --v             The version number for this release of the documentation.
                    Defaults to '0.0.0-dev'.
    --dryRun        Use dry-run mode. Do not push or publish any changes.
    --remove        Removes all versions matching the given filename-pattern.
    --pruneDev      Alias for --remove=0.0.0-dev*
    --noSetup       Run no setup. Only use this if you have previously run the setup step
                    without running the teardown step afterward.
    --noBuild       Do not build the documentation.
    --noCommit      Do not commit any changes.
    --noPush        Do not push any commits.
    --noPublish     Do not publish the result.
    --noTeardown    Run no cleanup at end of script. Implies --noCleanOnFail.
    --noCleanOnFail Do not run cleanup if script fails. Unless --noTeardown is set,
                    cleanup will still be run if script is successful.
    `);
} else if (removeSpecific || pruneDev) {
    let commitMessage;
    if (runSetup) {
        cloneDocsRepo();
        checkOutBranch();
    }
    if (pruneDev) {
        remove('0.0.0-dev*');
        commitMessage = 'chore(docs): prune dev-versions';
    }
    if (removeSpecific) {
        remove(argv.remove);
        commitMessage = `chore(docs): remove ${argv.remove}`;
    }
    if (commitMessage && runCommit) {
        commit(commitMessage);
    }
    if (runPublish) {
        publish();
    }
    if (runPush) {
        push();
    }
    if (runTeardown) {
        teardown(true);
    }
} else {
    if (runSetup) {
        cloneDocsRepo();
        checkOutBranch();
    }
    if (runBuild) {
        build();
    }
    if (runBuild) {
        copyBuildOutput();
    }
    if (runCommit) {
        commit();
    }
    if (runPublish) {
        publish();
    }
    if (runPush) {
        push();
    }
    if (runTeardown) {
        teardown(true);
    }
}

function cloneDocsRepo() {
    if (!shell.which('git')) {
        shell.echo('Sorry, this script requires git');
        shell.exit(1);
    }

    if (
        shell.exec(
            'git clone --no-checkout https://$GH_TOKEN@github.com/Lundalogik/lime-elements-docs.git docsDist'
        ).code !== 0
    ) {
        shell.echo('git clone failed!');
        teardown();
        shell.exit(1);
    }
}

function checkOutBranch() {
    shell.cd('docsDist');

    if (shell.exec('git checkout master').code !== 0) {
        shell.echo('git checkout master failed!');
        shell.cd('..');
        teardown();
        shell.exit(1);
    }

    shell.cd('..');
}

function build() {
    try {
        const options = {
            files: ['doczrc.js'],
            from: /base: '\/'/g,
            to: `base: '/versions/${version}/'`,
        };
        replace.sync(options);

        const options2 = {
            files: ['src/examples/example.tsx', 'src/examples/props.tsx'],
            from: /const BASE_URL = '\/';/g,
            to: `const BASE_URL = '/versions/${version}/';`,
        };
        replace.sync(options2);

        const options3 = {
            files: ['src/index.html'],
            from: [
                /<base href="\/">/g,
                /href="\/public\/stencil/g,
                /src="\/public\/stencil/g,
            ],
            to: [
                `<base href="/versions/${version}/">`,
                `href="/versions/${version}/public/stencil`,
                `src="/versions/${version}/public/stencil`,
            ],
        };
        replace.sync(options3);

        const options4 = {
            files: ['stencil.config.docs.ts'],
            from: /baseUrl: '\/'/g,
            to: `baseUrl: '/versions/${version}/'`,
        };
        replace.sync(options4);

        const options5 = {
            files: ['src/index.mdx'],
            from: /<version>/g,
            to: `${version}`,
        };
        replace.sync(options5);

        shell.exec('git diff --name-status');
    } catch (error) {
        shell.echo('Error occurred:', error);
        teardown();
        shell.exit(1);
    }

    if (shell.exec('npm install').code !== 0) {
        shell.echo('npm install failed!');
        teardown();
        shell.exit(1);
    }

    if (shell.exec('npm run docz:build').code !== 0) {
        shell.echo('docz:build failed!');
        teardown();
        shell.exit(1);
    }
}

function copyBuildOutput() {
    // Create `versions` folder if it doesn't already exist.
    try {
        shell.mkdir('docsDist/versions');
    } catch (e) {
        // If mkdir failed, it's almost certainly because the dir already exists.
        // Just ignore the error.
    }

    shell.cd('docsDist/versions');

    shell.echo('Removing old version folder if it already exists.');
    shell.rm('-rf', version);

    if (shell.mkdir(version).code !== 0) {
        shell.echo(`mkdir docsDist/versions/${version} failed!`);
        shell.cd('../..');
        teardown();
        shell.exit(1);
    }

    shell.cd('../..');

    // Remove unnecessary extra copy of the Stencil app.
    shell.rm('-rf', '.docz/dist/stencil');

    if (
        shell.cp('-R', '.docz/dist/*', `docsDist/versions/${version}/`).code !==
        0
    ) {
        shell.echo('copying output failed!');
        teardown();
        shell.exit(1);
    }

    updateVersionList();
}

function remove(pattern) {
    shell.cd('docsDist/versions');
    shell.rm('-rf', pattern);
    shell.cd('../..');
    updateVersionList();
}

function updateVersionList() {
    shell.cd('docsDist');

    const files = fs.readdirSync('versions').filter(file => file !== 'latest');
    fs.writeFileSync(
        'versions.js',
        `window.versions = ${JSON.stringify(files)};`
    );

    shell.cd('..');

    // createLatestSymlink(files[files.length - 1]);
}

function createLatestSymlink(folder) {
    shell.cd('docsDist/versions');

    if (shell.ln('-sf', `${folder}`, 'latest').code !== 0) {
        if (
            shell.rm('latest').code !== 0 ||
            shell.ln('-sf', `${folder}`, 'latest').code !== 0
        ) {
            shell.echo('Creating latest-symlink failed!');
            teardown();
            shell.exit(1);
        }
    }

    shell.cd('../..');
}

function commit(message) {
    // shell.echo('setting git user info');
    // shell.exec('git config user.email "$GIT_AUTHOR_EMAIL"');
    // shell.exec('git config user.name "$GIT_AUTHOR_NAME"');

    message = message || `chore(docs): create docs ${version}`;
    shell.cd('docsDist');

    shell.exec('git add -A --ignore-errors');

    if (
        shell.exec(
            `git commit -m "${message}"`
            /* `git commit --author "$GIT_AUTHOR_NAME <$GIT_AUTHOR_EMAIL>" -m "${message}"` */
        ).code !== 0
    ) {
        shell.echo('git commit failed!');
        shell.cd('..');
        teardown();
        shell.exit(1);
    }

    shell.cd('..');
}

function push() {
    shell.cd('docsDist');

    if (dryRun) {
        shell.exec('git log -1');
        shell.echo('Dry-run, so skipping push.');
    } else if (
        shell.exec(
            'git push https://$GH_TOKEN@github.com/Lundalogik/lime-elements-docs.git HEAD:master'
        ).code !== 0
    ) {
        shell.echo('git push failed!');
        shell.cd('..');
        teardown();
        shell.exit(1);
    }

    shell.cd('..');
}

function publish() {
    shell.cd('docsDist');

    const command =
        'aws s3 sync . s3://lime-documentation-lime-elements --exclude ".git/*"';

    if (dryRun) {
        shell.exec(command + ' --dryrun');
    } else if (shell.exec(command).code !== 0) {
        shell.echo('aws s3 sync failed!');
        shell.cd('..');
        teardown();
        shell.exit(1);
    }

    shell.cd('..');
}

function teardown(finished) {
    if (finished || cleanOnFail) {
        shell.exec(
            'git checkout doczrc.js src/examples/example.tsx src/examples/props.tsx src/index.html src/index.mdx stencil.config.docs.ts'
        );
        shell.echo('Removing docs repo clone in docsDist.');
        shell.exec('rm -rf docsDist');
    }
}
