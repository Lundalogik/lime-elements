module.exports = async ({github, context}) => {
    const message = `Documentation has been published to https://lundalogik.github.io/lime-elements/versions/PR-${context.issue.number}/`;
    const response = await github.issues.listComments({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
    });

    const comments = response.data;
    for (const comment of comments) {
        if (comment.body === message) {
            return;
        }
    }

    await github.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body: message
    });
}
