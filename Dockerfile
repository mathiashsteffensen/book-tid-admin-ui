FROM node:14
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build
ENV PORT=80
EXPOSE 80
CMD yarn run start