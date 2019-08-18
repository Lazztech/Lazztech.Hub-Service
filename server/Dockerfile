FROM node:8.11-stretch

RUN apt-get update

ENV NODE_ENV docker
ENV PORT 80

EXPOSE 80

WORKDIR /usr/src/node-app

COPY package.json package.json

RUN npm install

COPY . .

RUN npm run build
# CMD ["npm", "run build"]

CMD ["npm", "start"]