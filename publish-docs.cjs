/* eslint-env node */
const shell = require('shelljs');
const fs = require('node:fs');
const replace = require('replace-in-file');
const argv = require('yargs').argv;

const version = argv.v || '0.0.0-dev';

const pruneDev = argv.pruneDev !== undefined;
const removeSpecific = !!argv.remove;
const artifactMode = !!argv.artifactMode;
const fromArtifact = argv.fromArtifact;

const runSetup = argv.noSetup === undefined;
const runBuild = argv.noBuild === undefined;
const runCommit = argv.noCommit === undefined;
const runPush = argv.noPush === undefined;
const forcePush = !!argv.forcePush;
const pruneOutdated = argv.noPruneOutdated === undefined;
const runTeardown = argv.noTeardown === undefined;

const cleanOnFail = runTeardown && argv.noCleanOnFail === undefined;
const dryRun = !!argv.dryRun && argv.dryRun !== 'false';

const BASE_URL = '/lime-elements/';

if (argv.h !== undefined) {
    shell.echo(`
usage: npm run docs:publish [-- [--v=<version>] [--remove=<pattern>]
                                [--pruneDev] [--noSetup] [--noBuild]
                                [--noCommit] [--noPush] [--noPruneOutdated]
                                [--noTeardown] [--dryRun] [--noCleanOnFail]
                                [--artifactMode] [--fromArtifact=<path>]]

    --v             The version number for this release of the documentation.
                    Defaults to '0.0.0-dev'.
    --dryRun        Use dry-run mode. Do not push any changes.
    --remove        Removes all versions matching the given filename-pattern.
    --pruneDev      Alias for --remove=0.0.0-dev*
    --noSetup       Run no setup. Only use this if you have previously run the
                    setup step without running the teardown step afterward.
    --noBuild       Do not build the documentation.
    --noCommit      Do not commit any changes.
    --noPush        Do not push any commits.
    --forcePush     Force-push commit. Only for use by the automated publish run
                    when a new version has been released. Any less important
                    runs, like those publishing the docs for a pull request,
                    should NOT use this flag.
    --noPruneOutdated
                    Do not remove docs for outdated patch versions.
    --noTeardown    Run no cleanup at end of script. Implies --noCleanOnFail.
    --noCleanOnFail Do not run cleanup if script fails. Unless --noTeardown
                    is set, cleanup will still be run if script is successful.
    --artifactMode  Build docs for artifact upload without git operations.
                    Outputs to www/ directory. Used by fork PR workflows.
    --fromArtifact  Publish docs from a pre-built artifact at the given path.
                    Skips the build step and publishes directly from the artifact.
    `);
} else if (artifactMode) {
    // Build docs for artifact upload, no git operations
    build();
    if (runTeardown) {
        teardown(true);
    }
} else if (fromArtifact) {
    // Publish from a pre-built artifact
    if (runSetup) {
        cloneDocsRepo();
    }

    if (runSetup) {
        pullAndRebase();
    }

    copyFromArtifact(fromArtifact);

    if (runCommit) {
        commit();
    }

    if (runPush) {
        push();
    }

    if (runTeardown) {
        teardown(true);
    }
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

    if (pruneOutdated) {
        pruneOldPatchVersions();
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

    // Run docs build twice to ensure no type errors.
    // (Known bug in Stencil, see https://github.com/stenciljs/core/issues/3534)
    if (shell.exec('npm run docs:build && npm run docs:build').code !== 0) {
        shell.echo('docs:build failed!');
        teardown();
        shell.exit(1);
    }

    if (shell.exec('npm run docs:context7').code !== 0) {
        shell.echo('docs:context7 generation failed!');
        teardown();
        shell.exit(1);
    }

    shell.exec('ls -la www');
}

function copyFromArtifact(artifactPath) {
    // Create `versions` folder if it doesn't already exist.
    try {
        shell.mkdir('docsDist/versions');
    } catch {
        // If mkdir failed, it's almost certainly because the dir already exists.
        // Just ignore the error.
    }

    shell.cd('docsDist/versions');

    shell.echo('Removing old version folder if it already exists.');
    shell.rm('-rf', version);

    shell.cd('../..');

    // The artifact contains: www/lime-elements/versions/{version}/, .kompendium/kompendium.json,
    // docs-index.html, docs-index.css
    const artifactVersionPath = `${artifactPath}/www${BASE_URL}versions/${version}`;

    shell.echo(
        `Copying docs from artifact ${artifactVersionPath} into docsDist/versions/`
    );
    if (shell.cp('-R', artifactVersionPath, 'docsDist/versions/').code !== 0) {
        shell.echo('copying artifact failed!');
        teardown();
        shell.exit(1);
    }

    // Copy kompendium.json from artifact's .kompendium directory if it exists
    const artifactKompendiumPath = `${artifactPath}/.kompendium/kompendium.json`;
    const kompendiumDest = `docsDist/versions/${version}`;
    if (
        fs.existsSync(artifactKompendiumPath) &&
        shell.cp('-R', artifactKompendiumPath, kompendiumDest).code !== 0
    ) {
        shell.echo('copying kompendium.json from artifact failed!');
        teardown();
        shell.exit(1);
    }

    // Copy markdown-docs from artifact if it exists
    const artifactMarkdownPath = `${artifactPath}/www/markdown-docs`;
    if (fs.existsSync(artifactMarkdownPath)) {
        shell.echo('Copying markdown documentation from artifact...');
        if (
            shell.cp(
                '-R',
                artifactMarkdownPath,
                `docsDist/versions/${version}/`
            ).code !== 0
        ) {
            shell.echo('copying markdown docs from artifact failed!');
            teardown();
            shell.exit(1);
        }
    }

    // Copy docs-index.html and docs-index.css from artifact to the version folder
    shell.echo(
        `Copying docs-index.html and docs-index.css to 'docsDist/versions/${version}/'`
    );
    if (
        shell.cp(
            `${artifactPath}/docs-index.html`,
            `docsDist/versions/${version}/`
        ).code !== 0 ||
        shell.cp(
            `${artifactPath}/docs-index.css`,
            `docsDist/versions/${version}/`
        ).code !== 0
    ) {
        shell.echo(
            '[WARNING] Copying docs-index.html or docs-index.css failed. Not critical, continuing.'
        );
    }

    updateVersionList();

    shell.echo(
        'Copying docs-index.html and docs-index.css from `latest` version'
    );
    if (
        shell.cp(
            '-f',
            'docsDist/versions/latest/docs-index.html',
            'docsDist/index.html'
        ).code !== 0 ||
        shell.cp(
            '-f',
            'docsDist/versions/latest/docs-index.css',
            'docsDist/docs-index.css'
        ).code !== 0
    ) {
        shell.echo(
            '[WARNING] Copying docs-index.html or docs-index.css from `latest` failed. Not critical, continuing.'
        );
    }
}

function copyBuildOutput() {
    // Create `versions` folder if it doesn't already exist.
    try {
        shell.mkdir('docsDist/versions');
    } catch {
        // If mkdir failed, it's almost certainly because the dir already exists.
        // Just ignore the error.
    }

    shell.cd('docsDist/versions');

    shell.echo('Removing old version folder if it already exists.');
    shell.rm('-rf', version);

    shell.cd('../..');

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

    // Copy kompendium.json from .kompendium directory (stable location)
    if (
        shell.cp(
            '-R',
            '.kompendium/kompendium.json',
            `docsDist/versions/${version}`
        ).code !== 0
    ) {
        shell.echo('copying kompendium.json failed!');
        teardown();
        shell.exit(1);
    }

    shell.echo('Copying markdown documentation...');
    if (
        shell.cp('-R', 'www/markdown-docs', `docsDist/versions/${version}/`)
            .code !== 0
    ) {
        shell.echo('copying markdown docs failed!');
        teardown();
        shell.exit(1);
    }

    shell.echo(
        `Copying docs-index.html and docs-index.css to 'docsDist/versions/${version}/'`
    );
    if (
        shell.cp('docs-index.html', `docsDist/versions/${version}/`).code !==
            0 ||
        shell.cp('docs-index.css', `docsDist/versions/${version}/`).code !== 0
    ) {
        shell.echo(
            '[WARNING] Copying docs-index.html or docs-index.css failed. Not critical, continuing.'
        );
    }

    updateVersionList();

    shell.echo(
        'Copying docs-index.html and docs-index.css from `latest` version'
    );
    if (
        shell.cp(
            '-f',
            'docsDist/versions/latest/docs-index.html',
            'docsDist/index.html'
        ).code !== 0 ||
        shell.cp(
            '-f',
            'docsDist/versions/latest/docs-index.css',
            'docsDist/docs-index.css'
        ).code !== 0
    ) {
        shell.echo(
            '[WARNING] Copying docs-index.html or docs-index.css from `latest` failed. Not critical, continuing.'
        );
    }
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
        // We need to filter out the symlinks to `latest` and `next` since they
        // are not actual versions. We don't use `next` anymore, but we have a
        // static symlink pointing to `latest`, to avoid breaking existing
        // links to `next`.
        .filter((file) => file !== 'latest' && file !== 'next');
    fs.writeFileSync(
        'versions.js',
        `window.versions = ${JSON.stringify(files)};`
    );

    shell.cd('..');

    // Keep only full release versions (X.Y.Z format). Any versions with
    // pre-release suffixes (like -dev, -alpha, -rc) or other non-standard
    // formats are not eligible as "Latest".
    const fullVersions = files.filter((file) => file.match(/^\d+\.\d+\.\d+$/));
    createSymlinkForRelease(fullVersions, 'latest');
}

function pruneOldPatchVersions() {
    shell.cd('docsDist');
    const files = fs
        .readdirSync('versions')
        // Never prune the `latest` and `next` symlinks.
        .filter((file) => file !== 'latest' && file !== 'next');
    shell.cd('..');

    const fullVersionRegex = /^(\d*)\.(\d*)\.(\d*)$/;
    const fullVersions = files.filter((file) => file.match(fullVersionRegex));

    const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base',
    });

    // -------
    // For any versions that have the same major and minor version, and only
    // differ in the patch version, keep only the latest.
    fullVersions.sort(collator.compare);
    fullVersions.reverse();

    let lastCheckedVersion = fullVersions.shift();
    const versionsToDelete = [];
    for (const item of fullVersions) {
        const lastChecked = lastCheckedVersion.match(fullVersionRegex);
        const current = item.match(fullVersionRegex);

        if (lastChecked[1] === current[1] && lastChecked[2] === current[2]) {
            versionsToDelete.push(item);
        }

        lastCheckedVersion = item;
    }
    // -------

    for (const item of versionsToDelete) {
        remove(item);

        if (runCommit) {
            commit(`chore(docs): remove old patch version ${item}`);
        }
    }
}

function createSymlinkForRelease(versions, alias) {
    // We need to sort the strings alphanumerically, which javascript doesn't
    // do by default. So I found this neat solution at
    // https://blog.praveen.science/natural-sorting-in-javascript/#solution
    // /ads
    const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base',
    });
    const sortedVersions = [...versions];
    sortedVersions.sort(collator.compare);

    const versionToLink = sortedVersions.pop();

    shell.echo(`Creating "${alias}"-link pointing to: ${versionToLink}`);

    createSymlink(versionToLink, alias);
}

function createSymlink(folder, alias) {
    shell.cd('docsDist/versions');

    if (
        shell.ln('-sf', `${folder}`, alias).code !== 0 &&
        (shell.rm(alias).code !== 0 ||
            shell.ln('-sf', `${folder}`, alias).code !== 0)
    ) {
        shell.echo(`Creating symlink '${alias}' failed!`);
        shell.cd('../..');
        teardown();
        shell.exit(1);
    }

    shell.cd('../..');
}

function commit(message) {
    message = message || `chore(docs): create docs ${version}`;
    shell.cd('docsDist');

    shell.exec('git add -A --ignore-errors');

    const result = shell.exec('git commit -m "$COMMIT_MESSAGE"', {
        env: { ...process.env, COMMIT_MESSAGE: message },
    });
    // If commit fails for any reason other than "nothing to commit", treat as error
    if (
        result.code !== 0 &&
        !result.stdout.includes('nothing to commit') &&
        !result.stdout.includes('no changes added to commit')
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
        shell.exec('git checkout src/index.html stencil.config.docs.ts');
        shell.echo('Removing docs repo clone in docsDist.');
        shell.exec('rm -rf docsDist');
    }
}
