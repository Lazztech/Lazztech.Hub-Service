# How to setup this boilerplate for a new project

- Replaced Gian-TS-Stack with Lazztech.Hub
- Replaced ts_stack_server with lazztech_hub_server
- Added the pipeline to jenkins blue ocean
    - After adding your repo, go back to Manage Jenkins -> Configure System -> GitHub -> Advanced -> “Re-register hooks for all jobs”
        - http://jayd.ml/jenkins/2019/03/05/jenkins-pipeline-webhooks.html
- Configure jenkins for private repo
    - https://jenkins.io/doc/book/blueocean/creating-pipelines/#remote-repository
- Enable github pages from master/docs in github repo settins
- Replace ssh ip address with new server ip address

