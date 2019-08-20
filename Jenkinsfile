pipeline {
  environment {
    registry = "gianlazzarini/lazztech_hub_server"
    registryCredential = 'dockerhub'
    dockerImage = ''
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
        git 'https://github.com/gianlazz/Lazztech.Hub.git'
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
        sshagent(credentials : ['fb01b444-0666-4510-a47a-99fa4df46948']){
          sh "# This line below is required to get ssh to work."
          sh "ssh -o StrictHostKeyChecking=no -l root 104.248.70.206 uname -a"
          sh """ssh root@104.248.70.206 << EOF
            docker ps
            rm -r -f Lazztech.Hub/
            git clone https://github.com/gianlazz/Lazztech.Hub.git
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