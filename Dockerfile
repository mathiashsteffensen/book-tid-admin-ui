FROM node:14
WORKDIR /app
COPY . .
RUN yarn install --production
RUN yarn build
ENV PORT=3000
EXPOSE 3000
CMD yarn run start