FROM node:12-buster
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY --chown=node:node . .
RUN npm install
CMD [ "node", "index.js" ]
