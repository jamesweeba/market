FROM node:13-alpine

RUN mkdir -p /home/market/
RUN mkdir -p /usr/lib/mybatis/
RUN mkdir -p /usr/lib/jvm/



WORKDIR /home/market/

ENV  JWT_SECRETE=indeedthisisasecret
ENV PG_HOST=mydb
ENV PG_PASSWORD=kayayo
ENV PG_DBNAME=quaci
ENV PG_USER=quaci
ENV PG_PORT=5432
ENV POSTGRES_CONNECT_TIMEOUT=25000
ENV POSTGRES_IDLE_TIMEOUT=1000
ENV PG_POOL_SIZE=500

# OSTGRES_USER=unicorn_user
# POSTGRES_PASSWORD=magical_password
# POSTGRES_DB=rainbow_database

 RUN apk  add openjdk8-jre

# ///usr/lib/jvm/java-1.7-openjdk
 ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk
 ENV PATH $PATH://usr/lib/vm/java-8-openjdk/bin

COPY . /home/market/

RUN mv mybatis-migrations-3.3.5  /usr/lib/mybatis/
# RUN rm mybatis-migrations-3.3.5

ENV MIGRATIONS=/usr/lib/mybatis/mybatis-migrations-3.3.5
ENV  PATH $PATH://usr/lib/mybatis/mybatis-migrations-3.3.5/bin

RUN npm install 
# RUN cd migrations/ && migrate up

CMD ["migrate up","/home/markets/migrations/"]
CMD ["node", "/home/market/src/index.js"]


