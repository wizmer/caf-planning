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

WORKDIR /app

COPY package.json ./
RUN npm install

COPY --from=build /app/build ./

# expose the app's port
EXPOSE 3000
# run the server
CMD ["node", "./index.js"]