pipeline {
    agent any
    
    tools {
        nodejs "NodeJS"
    }
    
    environment {
        // Set your Docker image name
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
                    def testScript = sh(script: 'npm run | grep "test"', returnStdout: true).trim()
                    if (testScript && !testScript.contains('Error: no test specified')) {
                        sh 'npm test'
                    } else {
                        echo 'No valid tests configured, skipping test execution'
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
                    // Check if Docker is available
                    def dockerAvailable = sh(script: 'which docker || true', returnStatus: true)
                    if (dockerAvailable == 0) {
                        docker.build("${env.DOCKER_IMAGE}:${env.BUILD_ID}")
                    } else {
                        echo 'Docker not available, skipping Docker build'
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
                script {
                    echo 'Deployment would happen here'
                    // Actual deployment commands would go here
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
        unstable {
            echo 'Pipeline completed with warnings'
        }
    }
}