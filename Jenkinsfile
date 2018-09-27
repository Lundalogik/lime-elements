pipeline {
    agent { label 'linux' }

    options {
        disableConcurrentBuilds()
    }

    triggers {
        cron('H 17 * * *')
    }

    stages {
        stage('Build and test') {
            steps {
                sh 'make build'
                script {
                    if (env.BRANCH_NAME.substring(0,3) == 'PR-') {
                        commitHashes = sh (
                            // Get all commits on the current branch,
                            // that does not appear on master
                            script: 'git cherry origin/master',
                            // Return the response, instead of printing
                            // it to the log.
                            returnStdout: true
                        // Split on whitespace.
                        ).trim().split();

                        // Commits are listed on the format `+ <hash>`,
                        // so even indexes are '+',
                        // and odd indexes are the hashes.
                        for (i = 0; i < commitHashes.size(); i += 2) {

                            // A '+' means this is a commit that will be
                            // added to master. Those are the ones we
                            // want to lint.
                            if (commitHashes[i] == '+') {
                                sh "make commitlint HASH=${commitHashes[i+1]}"
                            }
                        }
                    }
                }
                sh 'make lint'
                sh 'make test'
            }
        }

        stage('Publish package') {
            environment {
                GH_TOKEN = credentials('github-access-token')
                NPM_TOKEN = credentials('devnpm-access-token')
                CI = true

                // Author used to commit the changelog etcetera.
                // See https://github.com/semantic-release/git/tree/ca9de5fa08cf32a03d58f7422bd47b73489046d8#environment-variables
                GIT_AUTHOR_NAME = 'Lime Developer'
                GIT_AUTHOR_EMAIL = credentials('email-address-for-github-user-limego')
                GIT_COMMITTER_NAME = 'Lime Developer'
                GIT_COMMITTER_EMAIL = credentials('email-address-for-github-user-limego')
            }
            steps {
                script {
                    if (env.BRANCH_NAME == 'master') {
                        echo 'On master. Running release step.'
                        sh 'make release'
                    } else if (env.BRANCH_NAME.substring(0,3) == 'PR-') {
                        echo 'On PR branch. Running release step in dry-run mode.'
                        sh "make release_dry_run BRANCH=${env.BRANCH_NAME}"
                    } else {
                        echo('Not on master nor a PR branch. Skipping release step.')
                    }
                }
            }
        }
    }
}
