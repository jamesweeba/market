FROM node:13-alpine

RUN mkdir -p /home/market/

WORKDIR /home/market/

ENV  JWT_SECRETE=indeedthisisasecret
ENV PG_HOST=mydb
ENV PG_PASSWORD=kayayo
ENV PG_DBNAME=kayayo
ENV PG_USER=quaci
ENV PG_PORT=5432
ENV POSTGRES_CONNECT_TIMEOUT=25000
ENV POSTGRES_IDLE_TIMEOUT=1000
ENV PG_POOL_SIZE=500

# OSTGRES_USER=unicorn_user
# POSTGRES_PASSWORD=magical_password
# POSTGRES_DB=rainbow_database


COPY . /home/market/


RUN npm install 

CMD ["node", "/home/market/src/index.js"]


