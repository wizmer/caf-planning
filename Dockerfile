 # build stage
FROM node:20-alpine as build

WORKDIR /app
# copy everything
COPY . .
# install dependencies
RUN npm i
# build the SvelteKit app
RUN npm run build

# run stage, to separate it from the build stage, to save disk storage
FROM node:20-alpine

## INSTALL POSTGRES ##
RUN apk update
RUN apk add postgresql
RUN apk add openrc
RUN mkdir /run/postgresql
RUN chown postgres:postgres /run/postgresql/
USER postgres
RUN mkdir /var/lib/postgresql/data
RUN chmod 0700 /var/lib/postgresql/data
RUN initdb -D /var/lib/postgresql/data
RUN pg_ctl start -D /var/lib/postgresql/data
# RUN psql -f sql/create-tables.sql

USER root
RUN mkdir -p /etc/local.d/
RUN printf "#!/bin/sh\nsu postgres -c 'pg_ctl start -D /var/lib/postgresql/data'" > /etc/local.d/postgres-custom.start
RUN chmod +x /etc/local.d/postgres-custom.start
RUN rc-update add local default
RUN openrc

USER postgres
# RUN pg_ctl start -D /var/lib/postgresql/data
# RUN psql -c 'select 1'



WORKDIR /app

# COPY package.json ./


# RUN npm install

# COPY --from=build /app/build ./

# # expose the app's port
# EXPOSE 3000
# # run the server
# CMD ["node", "./index.js"]