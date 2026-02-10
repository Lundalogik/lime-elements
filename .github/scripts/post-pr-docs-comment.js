// Post a comment on a PR when docs have been published.
// Skips if the comment already exists (idempotent).
//
// Usage: node post-pr-docs-comment.js
// Required env vars: GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER

const https = require('https');

const token = process.env.GITHUB_TOKEN;
const repo = process.env.GITHUB_REPOSITORY;
const prNumber = parseInt(process.env.PR_NUMBER, 10);

if (!token || !repo || !prNumber) {
    console.error('Missing required environment variables: GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER');
    process.exit(1);
}

const [owner, repoName] = repo.split('/');
const message = `Documentation has been published to https://lundalogik.github.io/lime-elements/versions/PR-${prNumber}/`;

function request(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path,
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json',
                'Content-Type': 'application/json',
                'User-Agent': 'lime-elements-ci',
                'X-GitHub-Api-Version': '2022-11-28',
            },
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null });
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

async function main() {
    // Get existing comments
    const commentsRes = await request('GET', `/repos/${owner}/${repoName}/issues/${prNumber}/comments?per_page=100`);
    if (commentsRes.status !== 200) {
        console.error('Failed to fetch comments:', commentsRes.data);
        process.exit(1);
    }

    // Check if comment already exists
    if (commentsRes.data.some(c => c.body === message)) {
        console.log('Comment already exists, skipping.');
        return;
    }

    // Post comment
    const postRes = await request('POST', `/repos/${owner}/${repoName}/issues/${prNumber}/comments`, { body: message });
    if (postRes.status === 201) {
        console.log('Comment posted successfully.');
    } else {
        console.error('Failed to post comment:', postRes.data);
        process.exit(1);
    }
}

main().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});
