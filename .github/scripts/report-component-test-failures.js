// Make component-test failures (especially visual-regression ones) easy to act
// on without anyone knowing they need to dig out a zipped artifact.
//
// On every run of the component-tests job it:
//   - parses the Playwright JSON report (test-results/results.json),
//   - writes a plain-language job summary, and
//   - posts/updates ONE idempotent PR comment (found by a hidden marker) that
//     names the failed test(s), explains what the screenshots show, and links
//     the run where the `component-tests-results` artifact is attached.
// When the tests pass it edits any existing comment to a resolved state so a
// stale red comment doesn't linger after a fix.
//
// Usage: node report-component-test-failures.js
// Env (all optional except where noted):
//   TEST_OUTCOME       - outcome of the test step ('success' | 'failure'); used
//                        as a fallback when the JSON report is missing.
//   RUN_URL            - URL of the current workflow run (for the artifact link).
//   PR_NUMBER          - PR number; if absent (e.g. merge_group/push) the
//                        comment is skipped and only the job summary is written.
//   GITHUB_TOKEN       - token for the comment API (read-only on fork PRs, so a
//                        failed POST is downgraded to a warning, never fatal).
//   GITHUB_REPOSITORY  - "owner/repo".
//   GITHUB_STEP_SUMMARY - path of the job-summary file (set by Actions).
//
// This step must never flip the job's result: the test step already determines
// pass/fail, so any error in here is logged and we still exit 0.

const fs = require('fs');
const https = require('https');

const MARKER = '<!-- component-test-report -->';
const RESULTS_PATH = 'test-results/results.json';

const token = process.env.GITHUB_TOKEN;
const repo = process.env.GITHUB_REPOSITORY || '';
const prNumber = parseInt(process.env.PR_NUMBER || '', 10);
const runUrl = process.env.RUN_URL || '';
const testOutcome = process.env.TEST_OUTCOME || '';
const summaryPath = process.env.GITHUB_STEP_SUMMARY;

function request(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path,
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
                'Content-Type': 'application/json',
                'User-Agent': 'lime-elements-ci',
                'X-GitHub-Api-Version': '2022-11-28',
            },
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        data: data ? JSON.parse(data) : null,
                    });
                } catch {
                    resolve({ status: res.statusCode, data });
                }
            });
        });
        req.setTimeout(30000, () => {
            req.destroy(new Error('Request timed out after 30s'));
        });
        req.on('error', reject);
        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

// Walk the Playwright JSON report and collect the specs that failed, noting
// whether each carries image attachments (i.e. it's a visual-regression diff).
function collectFailures(report) {
    const failures = [];
    const isImage = (a) =>
        (a.contentType && a.contentType.startsWith('image/')) ||
        /\.(png|jpg|jpeg)$/i.test(a.name || '');

    const walk = (suite, inheritedFile) => {
        const file = suite.file || inheritedFile;
        for (const spec of suite.specs || []) {
            if (spec.ok) {
                continue;
            }
            const attachments = (spec.tests || [])
                .flatMap((t) => t.results || [])
                .flatMap((r) => r.attachments || []);
            failures.push({
                title: spec.title,
                file: spec.file || file,
                hasScreenshots: attachments.some(isImage),
            });
        }
        for (const child of suite.suites || []) {
            walk(child, file);
        }
    };

    for (const suite of report.suites || []) {
        walk(suite, suite.file);
    }

    return failures;
}

function readReport() {
    try {
        return JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf8'));
    } catch {
        return null;
    }
}

function buildFailureBody(failures) {
    const visual = failures.filter((f) => f.hasScreenshots);
    const other = failures.filter((f) => !f.hasScreenshots);

    const lines = [];
    lines.push('### ⚠️ Component tests failed');
    lines.push('');

    const list = (items) =>
        items
            .map((f) => `- \`${f.file || '?'}\` › ${f.title}`)
            .join('\n');

    if (visual.length) {
        lines.push(
            'A **visual-regression** test failed — the rendered component no ' +
                'longer matches its committed reference screenshot:'
        );
        lines.push('');
        lines.push(list(visual));
        lines.push('');
        lines.push(
            'Playwright saved three images for each failure — the **expected** ' +
                'baseline, the **actual** render, and a **diff** that marks the ' +
                'changed pixels (**red** = real differences, **yellow** = ' +
                'anti-aliasing). They are attached to the run as the ' +
                '`component-tests-results` artifact:'
        );
        lines.push('');
        if (runUrl) {
            lines.push(
                `→ **[Open this run](${runUrl})**, then download ` +
                    '**`component-tests-results`** (under *Artifacts*, at the ' +
                    'bottom of the page). Unzip it and open the `*-diff.png` files.'
            );
        } else {
            lines.push(
                '→ Download **`component-tests-results`** from the run page ' +
                    '(under *Artifacts*), unzip it, and open the `*-diff.png` files.'
            );
        }
        lines.push('');
        lines.push(
            '**If the change is intended**, regenerate the baseline with ' +
                '`npm run test:examples:visual:update` (requires Docker; see ' +
                '`example-tests/components/README.md`) and commit the updated PNG.'
        );
    }

    if (other.length) {
        if (visual.length) {
            lines.push('');
            lines.push('---');
            lines.push('');
        }
        lines.push(
            visual.length
                ? 'The following component test(s) also failed:'
                : 'The following component test(s) failed:'
        );
        lines.push('');
        lines.push(list(other));
        if (runUrl) {
            lines.push('');
            lines.push(
                `See the [run logs](${runUrl}) for details (a trace is attached ` +
                    'to the `component-tests-results` artifact on failure).'
            );
        }
    }

    if (!failures.length) {
        // Outcome said failure but we couldn't parse specifics (e.g. the run
        // died before producing a report). Be honest rather than silent.
        lines.push(
            'The component-tests job failed before producing a test report ' +
                '(it may have crashed during setup). Check the run logs' +
                (runUrl ? ` — [open this run](${runUrl}).` : '.')
        );
    }

    return lines.join('\n');
}

const RESOLVED_BODY =
    '### ✅ Component tests passing\n\n' +
    'An earlier component-test failure was resolved on the latest commit.';

function writeSummary(body) {
    if (!summaryPath) {
        return;
    }
    try {
        fs.appendFileSync(summaryPath, `${body}\n`);
    } catch (err) {
        console.warn('Could not write job summary:', err.message);
    }
}

// Find our marker comment, paginating through every page: on a busy PR the
// marker can sit past the first 100 conversation comments, and missing it would
// post a duplicate (or leave a stale one unresolved). Stops early once found.
// Throws on a read failure so callers fall into their "never fatal" catch.
async function findMarkerComment(owner, name) {
    const base = `/repos/${owner}/${name}/issues/${prNumber}/comments`;
    for (let page = 1; ; page++) {
        const res = await request('GET', `${base}?per_page=100&page=${page}`);
        if (res.status !== 200 || !Array.isArray(res.data)) {
            throw new Error(`could not list PR comments (status ${res.status})`);
        }
        const found = res.data.find((c) => c.body && c.body.includes(MARKER));
        if (found) {
            return found;
        }
        if (res.data.length < 100) {
            return null;
        }
    }
}

async function upsertComment(body) {
    if (!token || !repo || !Number.isInteger(prNumber)) {
        console.log(
            'No PR context (or token/repo missing) — skipping PR comment.'
        );

        return;
    }
    const [owner, name] = repo.split('/');
    const base = `/repos/${owner}/${name}/issues/${prNumber}/comments`;

    try {
        const mine = await findMarkerComment(owner, name);
        const payload = { body: `${MARKER}\n${body}` };

        if (mine) {
            const res = await request(
                'PATCH',
                `/repos/${owner}/${name}/issues/comments/${mine.id}`,
                payload
            );
            console.log(
                res.status === 200
                    ? 'Updated existing PR comment.'
                    : `Failed to update comment (status ${res.status}).`
            );
        } else {
            const res = await request('POST', base, payload);
            console.log(
                res.status === 201
                    ? 'Posted PR comment.'
                    : `Failed to post comment (status ${res.status}).`
            );
        }
    } catch (err) {
        // Read-only token on fork PRs, network blips, etc. — never fatal.
        console.warn('Could not upsert PR comment:', err.message);
    }
}

async function main() {
    const report = readReport();
    const failures = report ? collectFailures(report) : [];
    const failed = failures.length > 0 || testOutcome === 'failure';

    if (failed) {
        const body = buildFailureBody(failures);
        writeSummary(body);
        await upsertComment(body);
    } else {
        // Passing run: only touch the comment if a stale failure one exists,
        // so we don't post noise on green PRs.
        await upsertCommentIfStale();
    }
}

// On a green run, edit a previously-posted failure comment to a resolved state.
// Does nothing if there's no such comment.
async function upsertCommentIfStale() {
    if (!token || !repo || !Number.isInteger(prNumber)) {
        return;
    }
    const [owner, name] = repo.split('/');
    try {
        const mine = await findMarkerComment(owner, name);
        if (mine && !mine.body.includes('✅')) {
            const res = await request(
                'PATCH',
                `/repos/${owner}/${name}/issues/comments/${mine.id}`,
                { body: `${MARKER}\n${RESOLVED_BODY}` }
            );
            console.log(
                res.status === 200
                    ? 'Marked existing PR comment resolved.'
                    : `Failed to update comment (status ${res.status}).`
            );
        }
    } catch (err) {
        console.warn('Could not update stale PR comment:', err.message);
    }
}

main()
    .catch((err) => {
        // Reporting must never flip the job result.
        console.warn('Reporter error (ignored):', err.message);
    })
    .finally(() => process.exit(0));
