# Full Stack Typescript/Node.js Stack For Cross Platform Solutions

| Platform    | CI/CD |
| ----------- | ----------- |
| Ionic       | [![Netlify Status](https://api.netlify.com/api/v1/badges/7eef933d-d51d-4b50-b531-298e96b64d51/deploy-status)](https://app.netlify.com/sites/confident-dubinsky-3e5f30/deploys)       |
| Server      | [![Build Status](http://jenkins.lazz.tech/job/Lazztech.Hub/job/master/badge/icon?style=flat-square)](http://jenkins.lazz.tech/blue/organizations/jenkins/Lazztech.Hub/)        |

## QuickStart

Install Dev Dependencies
1. Install VSCode: https://code.visualstudio.com/download
2. Install NodeJS LTS: https://nodejs.org/en/download/
3. Install Ionic Framework v4 CLI: https://ionicframework.com/docs/installation/cli
    - `npm install -g ionic`
4. Install Docker: https://www.docker.com/products/docker-desktop
5. Install Postgres: 
6. Setup Postgres DB For Develpment:
7. Modify the server/.env
    - cd server/
    - touch .env
    - copy over and modify values in the .env.sample 
8. Enable Typeorm CLI for migrations
    - npm i -g typeorm
9. Launch server and it will also run the db migrations
    - F5

Launch the project
- Clone The Repo
- Open VSCode
- Open Terminal In VSCode `cd server && npm install && cd - && cd ionic && npm install`
- Open Command Pallet
    - Type "Tasks: Run Task" & Hit Enter
    - Ionic Serve
- Open Command Pallet
    - Type "Tasks: Run Task" & Hit Enter
    - Run Server

**Coming Soon**
- Payments system


## Developer Documentation

- [Documentation](/docs/README.md)

---
Initial Setup Date: 05/17/2019

Gian Lazzarini