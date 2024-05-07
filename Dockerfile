FROM node

EXPOSE 5000

COPY . /bot

WORKDIR /bot

RUN npm install

RUN npm install nodemon --global
RUN npm install cheerio --save
RUN npm install axios --save
RUN npm install --save postgres
RUN npm install --save pg pg-hstore

CMD ["npm", "run", "start"]