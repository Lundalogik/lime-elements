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
            }
            steps {
                sshagent(['663e4b49-30f6-4c46-a018-a37ba604d7c8']) {
                    script {
                        if (env.BRANCH_NAME == 'master') {
                            sh 'make release'
                        } else {
                            echo('Skipping release step because this is not the master branch.')
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            deleteDir() /* clean up our workspace */
        }
    }
}
