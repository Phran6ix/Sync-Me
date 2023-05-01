FROM node:15

WORKDIR /app

COPY package.json .

RUN npm install

COPY . ./

ENV PORT 4100

EXPOSE 4100

CMD [ "npm", "start" ]



