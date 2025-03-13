FROM node:20-alpine

WORKDIR /src

COPY package.json ./

RUN npm install -g nodemon ts-node
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]