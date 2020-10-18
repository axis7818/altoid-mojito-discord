FROM node:12

WORKDIR /app/
COPY package* ./
RUN npm install

COPY . .

ENTRYPOINT ["node", "src/index.js"]
