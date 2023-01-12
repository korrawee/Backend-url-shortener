FROM node:18

# Set working directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# For production use
# RUN npm ci --only-produciton

# Bundle app source
COPY . .

RUN npm run build

CMD [ "node", "dist/main" ]