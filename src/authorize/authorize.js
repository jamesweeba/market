const jwt = require('jsonwebtoken');
const config = require('../config/config');
const api = require('../api/api');
const pg = require('pgconnect-lite');

module.exports = {
	auhorize: (req, res, next) => {
		let token = req.headers['x-access-token'];
		verifyToken(token)
			.then((results) => {
				console.log(results);
				console.log('llllllllllllllllllllllllllllllllllll');
				req.user = results;
				next();
			})
			.catch((err) => {
				pg.connect().then((client) => {
					let result = err.message;
					let params = { statusCode: 500, res, client, result };
					api.transactions(params);
				});
			});
	},
};

const verifyToken = function (token) {
	return new Promise((resolve, reject) => {
		if (!token) {
			return reject({ statusCode: 400, message: 'Invalid token' });
		}

		jwt.verify(token, config.jwtSecret, function (err, decoded) {
			if (err) {
				return reject({ statusCode: 500, message: err.message });
			}
			return resolve(decoded);
		});
	});
};

/*

const verifyToken = function (req, res, token, msg) {
	return new Promise((resolve, reject) => {
		const context = req.context;
		const logKey = context.logKey;
		// compare token  to to one in logout table
		if (msg.status == 201) {
			if (token) {
				jwt.verify(token, config.jwtSecret, function (err, decoded) {
					if (err) {
						return reject({ statusCode: 498, message: err.message });
					} else {
						req.decoded == decoded;
						return resolve(decoded);
					}
				});
			} else {
				// If there is no token, return an error
				logger.error({ statusCode: 401, message: 'User not authorized' });
				reject({ statusCode: 401, message: 'User not authorized' });
			}
		} else {
			logger.error({ statusCode: 498, message: 'Unable to verify user token' });
			return reject({ statusCode: 498, message: 'Unable to verify user token' });
		}
	});
};



*/
