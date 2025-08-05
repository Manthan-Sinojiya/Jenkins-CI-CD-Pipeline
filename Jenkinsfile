pipeline {
    agent any

    tools {
        nodejs "NodeJS" // Ensure this is configured in Jenkins under "Global Tool Configuration"
    }

    environment {
        DOCKER_IMAGE = "jenkins-app"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                script {
                    def hasTestScript = sh(
                        script: "node -e \"console.log(require('./package.json').scripts.test || '')\"",
                        returnStdout: true
                    ).trim()
                    
                    if (hasTestScript && !hasTestScript.contains("no test specified")) {
                        echo "Running tests..."
                        sh 'npm test'
                    } else {
                        echo 'No valid test script configured in package.json, skipping tests.'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            when {
                expression { return !currentBuild.resultIsWorseOrEqualTo('FAILURE') }
            }
            steps {
                script {
                    def dockerAvailable = sh(script: 'which docker', returnStatus: true)
                    if (dockerAvailable == 0) {
                        echo "Docker found. Building image..."
                        sh "docker build -t ${env.DOCKER_IMAGE}:${env.BUILD_ID} ."
                    } else {
                        echo 'Docker is not available in this environment. Skipping Docker image build.'
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                expression { return !currentBuild.resultIsWorseOrEqualTo('FAILURE') }
            }
            steps {
                echo 'Deployment would happen here.'
                // Insert deployment logic (e.g., kubectl, SSH, etc.)
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
        unstable {
            echo '⚠️ Pipeline completed with warnings (e.g., Docker not found)'
        }
    }
}
