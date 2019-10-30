pipeline {
    agent { label 'linux' }

    options {
        disableConcurrentBuilds()
    }

    triggers {
        cron('H 17 * * *')
    }

    stages {
        stage('Create docker container') {
            steps {
                withCredentials([
                    string(credentialsId: 'github-access-token', variable: 'GH_TOKEN')
                ]) {
                    sh 'make build'
                }
            }
        }
        stage('Lint code') {
            steps {
                sh 'make lint'
            }
        }
        stage('Run tests') {
            steps {
                sh 'make test'
            }
        }
        stage('Lint commits') {
            steps {
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
            }
        }

        stage('Build and release') {
            environment {
                GH_USERNAME = 'lime-ci'
                GH_TOKEN = credentials('github-access-token')
                NPM_TOKEN = credentials('npmjs-access-token')
                CI = true
            }
            steps {
                script {
                    if (env.BRANCH_NAME == 'master' || (env.BRANCH_NAME.length() > 8 && env.BRANCH_NAME.substring(0,8) == 'release-')) {
                        echo 'On master or release-branch. Running release step.'
                        sh 'make release'
                    } else {
                        if (env.BRANCH_NAME.substring(0,3) == 'PR-') {
                            echo 'On PR branch. Running release step in dry-run mode.'
                        } else {
                            echo('Unknown branch type. Running release step in dry-run mode.')
                        }
                        sh "make release_dry_run BRANCH=${env.BRANCH_NAME}"
                        // echo 'Docs are not built in dry-run. Run separately.'
                        // sh 'make build_docs'
                    }
                }
            }
        }
    }
}
