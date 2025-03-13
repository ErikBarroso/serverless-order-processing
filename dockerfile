FROM node:20-alpine

WORKDIR /src

COPY package.json ./

RUN npm install
RUN npm install -g nodemon
RUN npm install -g ts-node

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]