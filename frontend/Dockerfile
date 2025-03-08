FROM node:23.8.0

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
