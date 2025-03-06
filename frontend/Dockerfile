FROM node:23.8.0

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

# Set the env variable for polling
ENV CHOKIDAR_USEPOLLING=true

EXPOSE 3000

CMD ["npm", "run", "dev"]
