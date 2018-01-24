FROM node:alpine

WORKDIR /api-page

RUN apk add --no-cache git \
    && git clone https://github.com/Halyul/api-page.git /api-page \
    && mkdir /api-page/data \
    && npm install

CMD npm start
