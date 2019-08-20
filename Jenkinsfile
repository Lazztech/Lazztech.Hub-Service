pipeline {
  environment {
    registry = "gianlazzarini/lazztech_hub_server"
    registryCredential = 'dockerhub'
    dockerImage = ''
    GITHUB_PASSWORD = credentials('GITHUB_PASSWORD')
    ACCESS_TOKEN_SECRET = credentials('ACCESS_TOKEN_SECRET')
    EMAIL_FROM_ADDRESS = credentials('EMAIL_FROM_ADDRESS')
    EMAIL_PASSWORD = credentials('EMAIL_PASSWORD')
    FIREBASE_SERVER_KEY = credentials('FIREBASE_SERVER_KEY')
  }
  agent {
    dockerfile true
  }
  stages {
    stage('Cloning Git') {
      steps {
        checkout scm
      }
    }
    stage('Build') {
      steps {
        sh 'cd server/ && npm install'
      }
    }
    stage('Test') {
      steps {
        sh 'service postgresql start'
        sh 'cd server/ && npm test'
      }
    }
    stage('Building image') {
      steps{
        script {
          dockerImage = docker.build(registry + ":$BUILD_NUMBER", "./server/")
        }
      }
    }
    stage('Deploy Image') {
      steps{
        script {
          docker.withRegistry( '', registryCredential ) {
            dockerImage.push("latest")
          }
        }
      }
    }
    stage('Remove Unused docker image') {
      steps{
        sh "docker rmi $registry:$BUILD_NUMBER"
      }
    }
    stage('Deploy for production') {
      when {
        branch 'master'
      }
      steps{
        sshagent(credentials : ['LazztechHubSSHServerKey']){
          sh "# This line below is required to get ssh to work."
          sh "ssh -o StrictHostKeyChecking=no -l root 157.230.148.108 uname -a"
          sh """ssh root@157.230.148.108 << EOF
            docker ps
            rm -r -f Lazztech.Hub/
            git clone https://gianlazz:$GITHUB_PASSWORD@github.com/gianlazz/Lazztech.Hub.git
            ls
            pwd
            cd Lazztech.Hub
            pwd
            docker-compose down
            ACCESS_TOKEN_SECRET=$ACCESS_TOKEN_SECRET EMAIL_FROM_ADDRESS=$EMAIL_FROM_ADDRESS EMAIL_PASSWORD=$EMAIL_PASSWORD FIREBASE_SERVER_KEY=$FIREBASE_SERVER_KEY docker-compose pull
            ACCESS_TOKEN_SECRET=$ACCESS_TOKEN_SECRET EMAIL_FROM_ADDRESS=$EMAIL_FROM_ADDRESS EMAIL_PASSWORD=$EMAIL_PASSWORD FIREBASE_SERVER_KEY=$FIREBASE_SERVER_KEY docker-compose up -d
EOF
          """
        }
      }
    }
  }
}