# develop stage
FROM node:lts-alpine as develop-stage
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
# build stage
FROM develop-stage as build-stage
RUN yarn build

# production stage
FROM nginx:stable-alpine as production-stage
# Copy NGINX configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built app files
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Expose ports
EXPOSE 80
EXPOSE 443
# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]