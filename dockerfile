FROM node:20-alpine

WORKDIR /src

COPY package.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]