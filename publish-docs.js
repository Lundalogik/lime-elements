/* eslint-env node */
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
const forcePush = !!argv.forcePush;
const runTeardown = argv.noTeardown === undefined;

const cleanOnFail = runTeardown && argv.noCleanOnFail === undefined;
const dryRun = !!argv.dryRun && argv.dryRun !== 'false';

const BASE_URL = '/lime-elements/';

if (argv.h !== undefined) {
    shell.echo(`
usage: npm run docs:publish [-- [--v=<version>] [--remove=<pattern>] [--pruneDev]
                                [--noSetup] [--noBuild] [--noCommit] [--noPush]
                                [--noTeardown] [--dryRun] [--noCleanOnFail]
                                [--gitUser=<commit author name>]
                                [--gitEmail=<commit author email>]]

    --v             The version number for this release of the documentation.
                    Defaults to '0.0.0-dev'.
    --dryRun        Use dry-run mode. Do not push any changes.
    --remove        Removes all versions matching the given filename-pattern.
    --pruneDev      Alias for --remove=0.0.0-dev*
    --noSetup       Run no setup. Only use this if you have previously run the setup step
                    without running the teardown step afterward.
    --noBuild       Do not build the documentation.
    --noCommit      Do not commit any changes.
    --noPush        Do not push any commits.
    --forcePush     Force-push commit. Only for use by the automated publish run
                    when a new version has been released. Any less important
                    runs, like those publishing the docs for a pull request,
                    should NOT use this flag.
    --noTeardown    Run no cleanup at end of script. Implies --noCleanOnFail.
    --noCleanOnFail Do not run cleanup if script fails. Unless --noTeardown is set,
                    cleanup will still be run if script is successful.

    --authorName    Commit author name. Will update the local git config if set.
                    Will use existing git config if omitted.
    --authorEmail   Commit author email address. Will update the local git
                    config if set. Will use existing git config if omitted.
    `);
} else if (removeSpecific || pruneDev) {
    let commitMessage;
    if (runSetup) {
        cloneDocsRepo();
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

    if (runPush) {
        push();
    }

    if (runTeardown) {
        teardown(true);
    }
} else {
    if (runSetup) {
        cloneDocsRepo();
    }

    if (runBuild) {
        build();
    }

    if (runSetup) {
        pullAndRebase();
    }

    if (runBuild) {
        copyBuildOutput();
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

function cloneDocsRepo() {
    if (!shell.which('git')) {
        shell.echo('Sorry, this script requires git');
        shell.exit(1);
    }

    if (
        shell.exec(
            'git clone --single-branch --branch gh-pages https://$GH_TOKEN@github.com/Lundalogik/lime-elements.git docsDist'
        ).code !== 0
    ) {
        shell.echo('git clone failed!');
        teardown();
        shell.exit(1);
    }
}

function pullAndRebase() {
    shell.cd('docsDist');
    if (shell.exec('git pull --rebase').code !== 0) {
        shell.echo('git pull failed!');
        shell.cd('..');
        teardown();
        shell.exit(1);
    }

    shell.cd('..');
}

function build() {
    try {
        let options = {
            files: ['src/index.html'],
            from: [
                /href="\/favicon.svg"/g,
                /<base href="\/">/g,
                /="\/build/g,
                /="\/style/g,
                /="\/assets/g,
                /\/kompendium.json/g,
            ],
            to: [
                `href="${BASE_URL}versions/${version}/favicon.svg"`,
                `<base href="${BASE_URL}versions/${version}/">`,
                `="${BASE_URL}versions/${version}/build`,
                `="${BASE_URL}versions/${version}/style`,
                `="${BASE_URL}versions/${version}/assets`,
                `${BASE_URL}versions/${version}/kompendium.json`,
            ],
        };
        replace.sync(options);

        options = {
            files: ['stencil.config.docs.ts'],
            from: /baseUrl: '\/'/g,
            to: `baseUrl: '${BASE_URL}versions/${version}/'`,
        };
        replace.sync(options);

        options = {
            files: ['src/index.md'],
            from: /<version\\>/g,
            to: `${version}`,
        };
        replace.sync(options);

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

    if (shell.exec('npm run docs:build').code !== 0) {
        shell.echo('docs:build failed!');
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

    shell.cd('../..');

    shell.echo('Copying icons to shared folder in docsDist.');
    if (
        shell.cp(
            '-Ru',
            `www${BASE_URL}versions/${version}/assets/icons/*`,
            'docsDist/icons/'
        ).code !== 0
    ) {
        shell.echo('copying icons failed!');
        teardown();
        shell.exit(1);
    }

    shell.echo('Removing icons in new docs version.');
    if (
        shell.rm('-rf', `www${BASE_URL}versions/${version}/assets/icons`)
            .code !== 0
    ) {
        shell.echo('removing icons folder failed!');
        teardown();
        shell.exit(1);
    }

    shell.echo('Copying new docs version into docsDist/versions/');
    if (
        shell.cp(
            '-R',
            `www${BASE_URL}versions/${version}`,
            'docsDist/versions/'
        ).code !== 0
    ) {
        shell.echo('copying output failed!');
        teardown();
        shell.exit(1);
    }

    createIconSymlink();

    if (
        shell.cp('-R', 'www/kompendium.json', `docsDist/versions/${version}`)
            .code !== 0
    ) {
        shell.echo('copying kompendium.json failed!');
        teardown();
        shell.exit(1);
    }

    updateVersionList();
}

function createIconSymlink() {
    const path = `docsDist/versions/${version}/assets/`;
    shell.cd(path);
    shell.echo('Creating icons-symlink.');

    if (shell.ln('-sf', '../../../icons', 'icons').code !== 0) {
        shell.echo('Creating icons-symlink failed!');
        shell.cd('../../../..');
        teardown();
        shell.exit(1);
    }

    shell.cd('../../../..');
}

function remove(pattern) {
    shell.cd('docsDist/versions');
    shell.rm('-rf', pattern);
    shell.cd('../..');
    updateVersionList();
}

function updateVersionList() {
    shell.cd('docsDist');

    const files = fs
        .readdirSync('versions')
        .filter((file) => file !== 'latest');
    fs.writeFileSync(
        'versions.js',
        `window.versions = ${JSON.stringify(files)};`
    );

    shell.cd('..');

    // We need to sort the strings alphanumerically, which javascript doesn't
    // do by default. So I found this neat solution at
    // https://blog.praveen.science/natural-sorting-in-javascript/#solution
    // /ads
    const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base',
    });
    files.sort(collator.compare);

    // Keep only versions that begin with a digit. Any versions beginning with
    // a letter are pull requests, pre-releases, or other special cases, not
    // eligible as "Latest".
    const filteredVersions = files.filter((file) => file.match(/^[0-9].*/));

    const latestVersion = filteredVersions.pop();

    shell.echo(`Creating "latest"-link pointing to: ${latestVersion}`);

    createLatestSymlink(latestVersion);
}

function createLatestSymlink(folder) {
    shell.cd('docsDist/versions');

    // eslint-disable-next-line sonarjs/no-collapsible-if
    if (shell.ln('-sf', `${folder}`, 'latest').code !== 0) {
        if (
            shell.rm('latest').code !== 0 ||
            shell.ln('-sf', `${folder}`, 'latest').code !== 0
        ) {
            shell.echo('Creating latest-symlink failed!');
            shell.cd('../..');
            teardown();
            shell.exit(1);
        }
    }

    shell.cd('../..');
}

function commit(message) {
    message = message || `chore(docs): create docs ${version}`;
    shell.cd('docsDist');

    if (argv.authorName) {
        shell.echo('setting git config user.name');
        shell.exec(`git config --local user.name '${argv.authorName}'`);
    }

    if (argv.authorEmail) {
        shell.echo('setting git config user.email');
        shell.exec(`git config --local user.email '${argv.authorEmail}'`);
    }

    shell.exec('git add -A --ignore-errors');

    if (shell.exec(`git commit -m "${message}"`).code !== 0) {
        shell.echo('git commit failed!');
        shell.cd('..');
        teardown();
        shell.exit(1);
    }

    shell.cd('..');
}

function push() {
    shell.cd('docsDist');

    if (forcePush) {
        shell.echo('Using `git push --force`!');
    }

    if (dryRun) {
        shell.exec('git log -1');
        shell.echo('Dry-run, so skipping push.');
    } else if (
        shell.exec(
            `git push ${
                forcePush ? '--force' : ''
            } https://$GH_TOKEN@github.com/Lundalogik/lime-elements.git HEAD:gh-pages`
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
            'git checkout src/index.html src/index.md stencil.config.docs.ts'
        );
        shell.echo('Removing docs repo clone in docsDist.');
        shell.exec('rm -rf docsDist');
    }
}
