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
    --remove        Removes all versions matching the given filename-pattern.
    --pruneDev      Alias for --removeSpecific=0.0.0-dev*
    --noSetup       Run no setup. Only use this if you have previously run the setup step
                    without running the teardown step afterward.
    --noBuild       Do not build the documentation.
    --noCommit      Do not commit any changes.
    --noPush        Do not push any commits.
    --noTeardown    Run no cleanup at end of script. Implies --noCleanOnFail.
    --noCleanOnFail Do not run cleanup if script fails. Unless --noTeardown is set,
                    cleanup will still be run if script is successful.
    `);
} else if (removeSpecific || pruneDev) {
    if (runSetup) {
        setup();
    }
    if (pruneDev) {
        remove('0.0.0-dev*');
    }
    if (removeSpecific) {
        remove(argv.remove);
    }
    if (runCommit) {
        commit('chore(deploy docs): prune dev-versions');
    }
    if (runPush) {
        push();
    }
    if (runTeardown) {
        teardown(true);
    }
} else {
    if (runSetup) {
        setup();
    }
    if (runBuild) {
        build();
    }
    if (runCommit) {
        commit();
    }
    if (runPush) {
        push();
    }
    if (runTeardown) {
        teardown(true);
    }
}

function setup() {
    if (!shell.which('git')) {
        shell.echo('Sorry, this script requires git');
        shell.exit(1);
    }

    shell.echo('setting git user info');
    shell.exec('git config user.email "$GIT_AUTHOR_EMAIL"');
    shell.exec('git config user.name "$GIT_AUTHOR_NAME"');

    if (shell.mkdir('docsDist').code !== 0) {
        shell.echo('mkdir docsDist failed!');
        shell.exit(1);
    }

    if (
        shell.exec('git worktree add docsDist remotes/origin/gh-pages').code !==
        0
    ) {
        shell.echo('git worktree add failed!');
        teardown();
        shell.exit(1);
    }

    shell.cd('docsDist');

    if (shell.exec('git checkout gh-pages').code !== 0) {
        shell.echo('git checkout gh-pages failed!');
        shell.cd('..');
        teardown();
        shell.exit(1);
    }

    shell.cd('..');
}

function build() {
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

    try {
        const options = {
            files: [
                'doczrc.js',
                'src/examples/example.tsx',
                'src/examples/props.tsx',
                'src/index.html',
                'stencil.config.docs.ts',
            ],
            from: /\/lime-elements\//g,
            to: `/lime-elements/versions/${version}/`,
        };
        const changes = replace.sync(options);
        shell.echo('Modified files:', changes.join(', '));
        shell.exec('git diff');
    } catch (error) {
        shell.echo('Error occurred:', error);
        teardown();
        shell.exit(1);
    }

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

    const files = fs.readdirSync('versions');
    fs.writeFileSync(
        'versions.js',
        `window.versions = ${JSON.stringify(files)};`
    );

    shell.cd('..');
}

function commit(message) {
    message = message || 'chore(deploy docs): deploy latest docs to gh-pages';
    shell.cd('docsDist');

    shell.exec('git add -A --ignore-errors');

    if (
        shell.exec(
            `git commit --author "$GIT_AUTHOR_NAME <$GIT_AUTHOR_EMAIL>" -m "${message}"`
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
            'git push https://$GH_TOKEN@github.com/Lundalogik/lime-elements.git HEAD:gh-pages'
        ).code !== 0
    ) {
        shell.echo('git push failed!');
        shell.cd('..');
        teardown();
        shell.exit(1);
    }

    shell.cd('..');
}

function teardown(finished) {
    if (finished || cleanOnFail) {
        shell.exec(
            'git checkout doczrc.js src/examples/example.tsx src/examples/props.tsx src/index.html stencil.config.docs.ts'
        );
        shell.echo('Removing worktree for docsDist.');
        shell.exec('git worktree remove docsDist --force');
        shell.echo('Deleting local branch gh-pages.');
        shell.exec('git branch -D gh-pages');
    }
}
