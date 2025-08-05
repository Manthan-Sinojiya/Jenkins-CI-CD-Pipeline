pipeline {
    agent any
    tools {
        nodejs "NodeJS"  // Must match the name you configured
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', 
                url: 'https://github.com/Manthan-Sinojiya/Jenkins-CI-CD-Pipeline.git'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("Jenkins-app:${env.BUILD_ID}")
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    docker.withRegistry('', 'docker-hub-credentials') {
                        docker.image("Jenkins-app:${env.BUILD_ID}").push()
                    }
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}