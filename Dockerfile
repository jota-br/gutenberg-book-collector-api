FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
COPY src/ src/
RUN npm install --omit=dev

USER node

CMD [ "npm", "start" ]

EXPOSE 3000