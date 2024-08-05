# First stage of the build is to install dependencies, and build from source
FROM registry.access.redhat.com/ubi9/nodejs-20 as build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY src src
RUN npm run build

# Second stage of the build is to create a lighter container with just enough
# required to run the application, i.e production deps and compiled js files
FROM registry.access.redhat.com/ubi9/nodejs-20
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package*.json/ .
RUN npm ci --omit=dev
COPY --from=build /usr/src/app/build/ build/

# Copy in the default data
COPY ./data/ ./data/

ENV NODE_ENV=production
ENV HTTP_PORT 8080
ENV HTTP_HOST 0.0.0.0
EXPOSE 8080

ENTRYPOINT [ "node" ]
CMD [ "build/index.js" ]
