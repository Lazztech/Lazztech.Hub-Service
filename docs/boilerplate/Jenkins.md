# Jenkins Blue Ocean CI CD Setup

## Table of Contents
- [Setting Up Jenkins Blue Ocean Server](#setting-up-jenkins-blue-ocean-server)
- [Jenkinsfile Pipeline As Code](#jenkinsfile-pipeline-as-code)
- [Docker Build Agent](#docker-build-agent)
- [Using Environment Variables](#using-environment-variables)
- [Setting Up SSH Keys](#setting-up-ssh-keys)
- [Jenkins Credentials](#jenkins-credentials)
- [Jenkins Blue Ocean Parameters](#jenkins-blue-ocean-parameters)

## Setting Up Jenkins Blue Ocean Server

- docker run -d -p 80:8080 --volume jenkin_data:/var/jenkins_home jenkinsci/blueocean:latest
- docker ps
- docker logs -f ID_OF_THE_NEW_JENKINS_CONTAINER

Look for the setup code below the following:
```
*************************************************************
*************************************************************
*************************************************************

Jenkins initial setup is required. An admin user has been created and a password generated.
Please use the following password to proceed to installation:
```

## Configuring Github Webhooks
This will allow Jenkins to configure github to call jenkins build webhook on a push or pull request.
- http://jayd.ml/jenkins/2019/03/05/jenkins-pipeline-webhooks.html

## Jenkinsfile Pipeline As Code
The Jenkinsfile in the root of this repository is used by Jenkins Blue Ocean to define the pipeline.
This allows everything you need for the cicd process to be versioned and stored in your git repository.

The Jenkinsfile in this repo also uses a docker build agent defined in the pipeline to use the Dockerfile
at the root of this repository. This contains all build and testing dependencies.

Resources:
- https://medium.com/@gustavo.guss/jenkins-building-docker-image-and-sending-to-registry-64b84ea45ee9

## Docker Build Agent
- https://jenkins.io/doc/book/pipeline/docker/#dockerfile

You can configure the Jenkinsfile to build a Dockerfile and use it as the build agent.
To do so include the Dockerfile in the root of your repository and add the following as your build.
```
  agent { dockerfile true }
```

Notes:
- It doesn't however use the default starting command defined with the CMD line in the dockerfile. You must pass it in as an arg in the jenkinsfile.
  - https://issues.jenkins-ci.org/browse/JENKINS-51307

## Passing Environment Variables To Docker-Compose
Environment variables can be passed into commands by adding them before the process you're trying to execute. This should work with any shell process that depends on environment variables if you want a one off way to use them. Use this with the `docker-compose up -d` command to launch the services.

```
ACCESS_TOKEN_SECRET=YourSecretForJWTTokens EMAIL_FROM_ADDRESS=YourEmailAddress EMAIL_PASSWORD=YourEmailPassword docker-compose up
```

Here's what the deployment stage of the Jenkinsfile looks like making use of this technique over ssh.
```
    stage('Deploy') {
      steps{
        sshagent(credentials : ['fb01b444-0666-4510-a47a-99fa4df46948']){
          sh "ssh -o StrictHostKeyChecking=no -l root 104.248.70.206 uname -a"
          sh """ssh root@104.248.70.206 \
            docker ps
          """
          sh """ssh root@104.248.70.206 \
            rm -r -f Gian-TS-Stack/
          """
          sh """ssh root@104.248.70.206 \
            git clone https://github.com/gianlazz/Gian-TS-Stack.git \
            && \
            cd Gian-TS-Stack \
            && \
            docker-compose down \
            && \
            ACCESS_TOKEN_SECRET=$ACCESS_TOKEN_SECRET EMAIL_FROM_ADDRESS=$EMAIL_FROM_ADDRESS EMAIL_PASSWORD=$EMAIL_PASSWORD docker-compose pull \
            && \
            ACCESS_TOKEN_SECRET=$ACCESS_TOKEN_SECRET EMAIL_FROM_ADDRESS=$EMAIL_FROM_ADDRESS EMAIL_PASSWORD=$EMAIL_PASSWORD docker-compose up -d
          """
        }
      }
    }
```

Resources Used:
- https://stackoverflow.com/questions/49293967/how-to-pass-environment-variable-to-docker-compose-up

## Using Environment Variables
Use environment variables with your jenkins blue ocean containerized build by enabling environment variables in the jenkins configure page, adding your variables then using the following in your jenkinsfile:

```
${env.YOUR_ENVIRONMENT_VARIABLE}
```

- https://stackoverflow.com/questions/48804361/jenkins-blue-ocean-environment-variables

Alternative approach to accessing secret variables:

- https://stackoverflow.com/questions/46291750/jenkins-blueocean-same-jenkinsfile-across-multiple-environments-while-passing

## Setting Up SSH Keys
Install SSH Agent Plugin
- https://jenkins.io/doc/pipeline/steps/ssh-agent/

**Setting Up SSH Keys For SSH Agent Plugin In pipelines as code**

SSH Into Target Deployment VM
- `ssh root@IP_OF_YOUR_DEPLOYMENT_VM`
- `ssh-keygen`
- `cd ~/.ssh`
- `cat id_rsa.pub >> authorized_keys`
- Copy the output of this command: `cat ~/.ssh/id_rsa`

Add the private key to jenkins credentials
- Jenkins -> Credentials -> System -> Global Credentials -> Add Credentials
    - Scope: Global
    - ID: Leave Empty It will generate and id
    - Description: Enter whatever description for your deployment vm
    - Username: root
    - Private Key:
        - Enter Directly
        - Paste in the private key you copied earlier from `cat ~/.ssh/id_rsa`
    - Password: Enter ssh password for your server you intend to ssh into
- Save
- Open the credential you just made
- Copy the generated id

After this configuration sshagent steps should then work in your Jenkinsfile.
Below in this example the first line configures the key.

This should work after you've pasted in your credentials id in `credentials : ['PASTE YOUR CREDENTIAL ID HERE']`
```
    stage('Deploy') {
      steps{
        sshagent(credentials : ['fb01b444-0666-4510-a47a-99fa4df46948']){
          sh "ssh -o StrictHostKeyChecking=no -l root 104.248.70.206 uname -a"
          sh "ssh root@104.248.70.206"          
        }
      }
    }
```

---
Resources Used:
- https://www.karthikeyan.tech/devops/ssh-agent-blue-ocean-via-jenkins-pipeline-as-code.html
- https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys--2
- https://stackoverflow.com/questions/44237417/how-do-i-use-ssh-in-a-jenkins-pipeline

## Jenkins Credentials
- https://jenkins.io/doc/book/pipeline/jenkinsfile/#handling-credentials

## Jenkins Blue Ocean Parameters
- [Jenkins Blue Ocean Parameters](https://www.youtube.com/watch?v=5_tvlaIeQUQ)

- https://stackoverflow.com/questions/46659862/how-to-mask-a-password-field-in-jenkins-pipeline-project