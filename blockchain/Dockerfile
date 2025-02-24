FROM node:14

WORKDIR /app/blockchain

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8545

CMD ["npm", "start"]