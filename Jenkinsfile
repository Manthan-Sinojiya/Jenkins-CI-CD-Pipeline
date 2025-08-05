pipeline {
    agent any
    
    tools {
        nodejs "NodeJS"  // Make sure this matches your Jenkins configuration
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
                    // Only run tests if they exist
                    def hasTests = sh(script: 'grep "test" package.json', returnStatus: true) == 0
                    if (hasTests) {
                        sh 'npm test'
                    } else {
                        echo 'No tests configured, skipping test stage'
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
                    sh 'docker-compose down || true'  // Ignore errors if not running
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