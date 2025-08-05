pipeline {
    agent any
    
    tools {
        nodejs "NodeJS"
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
                    // Check if test script exists and isn't the default error message
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
                    docker.build("Jenkins-app:${env.BUILD_ID}")
                }
            }
        }
        
        stage('Deploy') {
            when {
                expression { return !currentBuild.resultIsWorseOrEqualTo('FAILURE') }
            }
            steps {
                script {
                    sh 'docker-compose down || true'
                    sh 'docker-compose up -d'
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
    }
}