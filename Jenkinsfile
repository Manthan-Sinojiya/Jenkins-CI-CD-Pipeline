pipeline {
    agent {
        docker {
            image 'node:20-alpine'   // Pre-installs Node.js and npm
            args '-v /var/run/docker.sock:/var/run/docker.sock'  // Allows Docker-in-Docker
        }
    }
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')  // Store in Jenkins Credentials
    }
    
    stages {
        // Stage 1: Checkout Code
        stage('Checkout') {
            steps {
                checkout scm  // Checks out the code from your SCM
            }
        }
        
        // Stage 2: Install Dependencies
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        // Stage 3: Run Tests
        stage('Test') {
            steps {
                sh 'npm test'  // Make sure you have tests in package.json
            }
        }
        
        // Stage 4: Build Docker Image
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("demo-app:${env.BUILD_ID}")
                }
            }
        }
        
        // Stage 5: Push to Docker Hub
        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                        docker.image("demo-app:${env.BUILD_ID}").push()
                    }
                }
            }
        }
        
        // Stage 6: Deploy
        stage('Deploy') {
            steps {
                sh 'docker-compose down && docker-compose up -d'  // Requires docker-compose.yml
            }
        }
    }
    
    post {
        always {
            cleanWs()  // Clean workspace after build
        }
        success {
            slackSend(color: 'good', message: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'")
        }
        failure {
            slackSend(color: 'danger', message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'")
        }
    }
}