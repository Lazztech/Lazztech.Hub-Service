# How to setup this boilerplate for a new project

- Replaced Gian-TS-Stack with Lazztech.Hub address across repo
- Replaced ts_stack_server with lazztech_hub_server address across repo
- Added the pipeline to jenkins blue ocean
    - After adding your repo, go back to Manage Jenkins -> Configure System -> GitHub -> Advanced -> “Re-register hooks for all jobs”
        - http://jayd.ml/jenkins/2019/03/05/jenkins-pipeline-webhooks.html
- Configure jenkins for private repo which just involves changing the git clone step in the Jenkinsfile to `checkout scm`
    - https://stackoverflow.com/a/50057292
- Setup the Jenkinsfile to deploy with private repo
    - https://stackoverflow.com/questions/10054318/how-do-i-provide-a-username-and-password-when-running-git-clone-gitremote-git
    - Add GITHUB_PASSWORD secret text credential to jenkins
- Enable github pages from master/docs in github repo settings
- Add ssh key for new server to jenkins
    - [Jenkins doc](./Jenkins.md)
    - Change the id in the deployment ssh section of the Jenkinsfile to the new id.
- Replace ip address with new server ip address across repo
- Setup the ssl certificate on the server
    - [Setup HTTPS SSL](./SetupHttpsSSL.md)
- Change Ionic server variable to point at new server

# Not done yet
- Setup netlify
- Add Ionic design assets


