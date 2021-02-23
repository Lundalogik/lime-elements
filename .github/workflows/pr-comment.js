module.exports = async ({github, context}) => {
    // Get a list of all issues created by the PR opener
    // See: https://octokit.github.io/rest.js/#pagination
    // const creator = context.payload.sender.login
    // const opts = github.issues.listForRepo.endpoint.merge({
    //     ...context.issue,
    //     state: 'all'
    // })
    // const issues = await github.paginate(opts)

    // for (const issue of issues) {
    //     if (issue.number === context.issue.number) {
    //         return;
    //     }

    //     if (issue.pull_request) {
    //         return // Creator is already a contributor.
    //     }
    // }

    await github.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: `Documentation has been published to https://lundalogik.github.io/lime-elements/versions/PR-${context.issue.number}/`
    });
}
