FROM node:12.19.0-alpine3.12

# Install python, make and g++
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 make g++ && ln -sf python3 /usr/bin/python

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

RUN npm i -g nodemon

WORKDIR /home/node/app

USER node

COPY --chown=node:node . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "serve"]
