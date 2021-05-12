const pg = require('pgconnect-lite');
const startApp = require('./app');
const express = require('express');
const app = express();


let postgres = {
	host: process.env.PG_HOST || 'localhost',
	user: process.env.PG_USER || 'quaci',
	password: process.env.PG_PASSWORD || '',
	database: process.env.PG_DBNAME || 'kayayo',
	port: process.env.PG_PORT || 5432,
	connectionTimeoutMillis: process.env.POSTGRES_CONNECT_TIMEOUT || 25000,
	idleTimeoutMillis: process.env.POSTGRES_IDLE_TIMEOUT || 10000,
	max: process.env.PG_POOL_SIZE || 500,
};

pg.init(postgres);
startApp.start(app);
