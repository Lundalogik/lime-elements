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
                sh 'make test'
            }
        }

        stage('Publish package') {
            environment {
                GH_TOKEN = credentials('ads-tmp')
                NPM_TOKEN = credentials('devnpm-access-token')
                CI = true
            }
            steps {
                script {
                    if (env.BRANCH_NAME == 'master') {
                        sh 'make release'
                    }
                }
            }
        }
    }
}
