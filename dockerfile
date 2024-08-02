FROM node:20-alpine
WORKDIR /app
COPY . .
RUN yarn && yarn build
USER node
CMD ["yarn", "serve"]