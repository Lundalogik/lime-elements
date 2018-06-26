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
                sh 'npm build'
                sh 'npm test'
            }
        }

        stage('Publish package') {
            environment {
                GITHUB_TOKEN = credentials('github-access-token')
                NPM_TOKEN = credentials('devnpm-access-token')
            }
            steps {
                script {
                    if (env.BRANCH_NAME == 'master') {
                        sh 'npx semantic-release'
                    }
                }
            }
        }
    }
}
