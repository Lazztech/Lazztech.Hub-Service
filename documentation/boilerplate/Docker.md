# Build Docker

https://stackoverflow.com/questions/50278632/what-does-localhost-means-inside-a-docker-container

- Launch solution with Docker-Compose
    - Create docker-compose.yml based off of the docker-compose.yml
    - docker-compose build --force-rm --no-cache
    - docker-compose up

- Build Server Container Alone
    - cd server/
    - docker build -t gianlazzarini/ts_face_server .
    - docker run gianlazzarini/ts_face_server

If you're having issues you can clear out the images:
- docker kill $(docker ps -q)
- docker rm $(docker ps -a -q)
- docker rmi $(docker images -q)

- Add an ormconfig.json to the server based on ormconfig.sample.json
- Add a .env file to the server based on .env.sample