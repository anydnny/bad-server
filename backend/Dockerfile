FROM node:22-alpine
RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
COPY ./src/public /app/src/public
CMD ["npm", "run", "dev"]
