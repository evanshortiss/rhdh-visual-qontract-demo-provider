# First stage of the build is to install dependencies, and build from source
FROM registry.access.redhat.com/ubi8/nodejs-20 as build

# Using alternative directories requires more complex permission changes. This
# is the default directory from the base image, but it's good to be explicit.
WORKDIR /opt/app-root/src

COPY --chown=1001:1001 package*.json ./
RUN npm ci
COPY --chown=1001:1001 tsconfig*.json ./
COPY --chown=1001:1001 src src
RUN npm run build

# Second stage of the build is to create a lighter container with just enough
# required to run the application, i.e production deps and compiled js files
FROM registry.access.redhat.com/ubi8/nodejs-20
WORKDIR /opt/app-root/src

COPY --chown=1001:1001 --from=build /opt/app-root/src/package*.json/ .
RUN npm ci --omit=dev
COPY --chown=1001:1001 --from=build /opt/app-root/src/build/ build/

# Copy in the default data, e.g home.json
COPY ./data/ ./data/

ENV NODE_ENV=production
ENV HTTP_PORT 8080
ENV HTTP_HOST 0.0.0.0
EXPOSE 8080

ENTRYPOINT [ "node" ]
CMD [ "build/index.js" ]
