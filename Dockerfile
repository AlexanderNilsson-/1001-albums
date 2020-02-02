FROM node:11.6
EXPOSE 7000 

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# Bundle app source
COPY . .

#CMD ./code/scripts/start.sh
CMD [ "npm", "run", "dev" ]
