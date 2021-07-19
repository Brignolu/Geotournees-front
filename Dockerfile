FROM node:14 as build-stage

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
#COPY nginx_config/nginx.conf /usr/src/app/nginx_config/nginx.conf
#COPY nginx_config/default.conf /usr/src/app/nginx_config/conf.d/default.conf

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g","daemon off;" ]
