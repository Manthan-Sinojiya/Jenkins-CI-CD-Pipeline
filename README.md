# Jenkins CI/CD Pipeline with Docker and Node.js

![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=Jenkins&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

A complete Jenkins pipeline for building, testing, and deploying Node.js applications with Docker.

## 📋 Prerequisites

- Docker installed ([Install Guide](https://docs.docker.com/engine/install/))
- Jenkins installed ([Install Guide](https://www.jenkins.io/doc/book/installing/))
- Node.js project with `package.json`

## 🚀 Quick Start

1. **Run Jenkins with Docker**:
   ```bash
   docker run --name jenkins      -d      -p 8080:8080      -p 50000:50000      -v jenkins_home:/var/jenkins_home      -v /var/run/docker.sock:/var/run/docker.sock      -u root      jenkins/jenkins:lts
   ```

2. **Get initial admin password**:
   ```bash
   docker logs jenkins
   ```

3. **Access Jenkins** at `http://localhost:8080`

## 🔧 Jenkins Configuration

1. **Install required plugins**:
   - Docker Pipeline
   - NodeJS
   - Blue Ocean (recommended)

2. **Configure global tools**:
   - Manage Jenkins → Tools → Add NodeJS installation
   - Name: `NodeJS` (must match Jenkinsfile)
   - Select latest LTS version

## 📂 Project Structure

```
├── Jenkinsfile          # Pipeline definition
├── Dockerfile           # Docker configuration
├── package.json         # Node.js dependencies
├── app.js               # Application code
└── test/                # Test files (optional)
```

## 🛠️ Jenkinsfile

```groovy
pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        
        stage('Install') {
            steps { sh 'npm install' }
        }
        
        stage('Test') {
            steps {
                script {
                    def hasTests = sh(script: '''
                        grep -q "test" package.json && 
                        ! grep -q "Error: no test specified" package.json
                    ''', returnStatus: true) == 0
                    if (hasTests) { sh 'npm test' } 
                    else { echo 'No valid tests configured' }
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    try {
                        sh 'docker build -t myapp:${BUILD_ID} .'
                    } catch (err) {
                        echo "Docker build failed: ${err}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
    }
    
    post {
        always { cleanWs() }
    }
}
```

## 🐳 Dockerfile Example

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
```

## 🔍 Troubleshooting

| Error | Solution |
|-------|----------|
| `docker: not found` | Ensure Docker is installed and Jenkins has permissions |
| `npm: not found` | Configure NodeJS tool in Jenkins |
| Permission denied | Run `sudo usermod -aG docker jenkins` |
