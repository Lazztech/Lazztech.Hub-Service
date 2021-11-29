pipeline {
  environment {
    REGISTRY = "registry.internal.lazz.tech/lazztechhub-service"
    dockerImage = ''
    NODE_VERSION = '12'
  }
  agent {
    docker { 
      image 'node:12'
      args "-u root"
    }
  }
  stages {
    stage('npm install & build') {
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }
    stage('npm format:check') {
      steps {
        sh 'npm run format:check'
      }
    }
    stage('npm lint') {
      steps {
        sh 'npm run format:check'
      }
    }
    stage('npm test:cov') {
      steps {
        sh 'npm run test:cov'
      }
    }
    stage('npm test:e2e local') {
      steps {
        sh 'npm run test:cov'
      }
      environment {
        CI = true
        APP_NAME = 'Test Lazztech Hub'
        ACCESS_TOKEN_SECRET = 'SecretKey'
        FIREBASE_SERVER_KEY = 'test'
        PUSH_NOTIFICATION_ENDPOINT = 'test'
        EMAIL_FROM_ADDRESS = 'test'
        EMAIL_PASSWORD = 'test'
        DATABASE_TYPE = 'sqlite'
        FILE_STORAGE_TYPE = 'local'
      }
    }
    stage('Building image') {
      steps{
        script {
          dockerImage = docker.build(REGISTRY + ":$BUILD_NUMBER", "./")
        }
      }
    }
    stage('Deploy Image') {
      steps{
        script {
          docker.withRegistry(REGISTRY) {
            dockerImage.push("latest")
          }
        }
      }
    }
    stage('Remove Unused docker image') {
      steps{
        sh "docker rmi $REGISTRY:$BUILD_NUMBER"
      }
    }
  }
}