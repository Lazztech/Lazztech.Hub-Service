FROM node:12-alpine

WORKDIR /app

COPY package.json /app/package.json

# --- Uncomment lines to have container just copy built server
# COPY node_modules node_modules
# COPY dist dist
# ---

# --- Uncomment lines to have container build server itself
COPY package-lock.json /app/package-lock.json
COPY src /app/src
COPY tsconfig.build.json /app/tsconfig.build.json
RUN npm install
RUN npm run build
COPY dist /app/dist
# ---

EXPOSE 8080
CMD [ "npm", "run", "start:prod" ]