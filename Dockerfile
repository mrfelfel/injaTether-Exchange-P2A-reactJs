FROM node:latest
WORKDIR /usr/src/frontapp
COPY package.json ./
RUN npm install
RUN npm install -g serve
RUN npm run build
COPY . .
CMD ["serve", "-l", "tcp://localhost:1234", "build"]