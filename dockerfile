FROM node:20-alpine

WORKDIR /src

COPY package.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]