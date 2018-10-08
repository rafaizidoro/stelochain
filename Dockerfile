FROM node:8.12

RUN mkdir -p /stelochain
WORKDIR /stelochain

RUN apt-get update \
    && apt-get install -y \
    build-essential \
    nodejs \
    redis-server \
    --fix-missing \
    --no-install-recommends \
    && apt-get clean

RUN npm install node-gyp -g

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000

CMD ["./start.sh"]