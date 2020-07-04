FROM node:10

WORKDIR /app/
COPY package* ./
RUN npm install

COPY . .

ENTRYPOINT ["node", "index.js"]