const controller = require('./controller');
const pg = require('pgconnect-lite');
const api = require('../api/api');

module.exports = {
	login: function (req, res) {
		pg.connect()
			.then((client) => {
				let data = { authorization: req.headers.authorization };
				//paylaod validations
				controller
					.login(client, data)
					.then((result) => {
						let params = { statusCode: 200, res, client, result };
						if (!result) {
							params = { statusCode: 404, res, client, result: 'Invalid username or password' };
						}

						api.transactions(params);
					})
					.catch((err) => {
						let params = { statusCode: 500, res, client };
						api.transactions(params);
					});
			})
			.catch((err) => {
			
				let params = { statusCode: 500, res, client };
				api.transactions(params);
			});
	},

	signup: function (req, res) {
		let db=null
		pg.connect()
			.then((client) => {
				db=client
				let payload = req.body;
				controller
					.signup(client, payload)
					.then((result) => {
						console.log(result['items'])
						let role = result['items'][0].role;
						if (role != 'manager') {
							let param = { payload, client, result };
							return controller.createAgent(param);
						}
						return result;
					})
					.then((result) => {
						let params = { statusCode: 200, res, client, result };
						if (result.statusCode == 400) {
							params = { statusCode: 400, res, client, result: result.message };
						}
						api.transactions(params);
					})
					.catch((err) => {
						console.log(err);
						let params = { statusCode: 500, res, client };
						 api.transactions(params);
					});
			})
			.catch((err) => {
				console.log(err);
				let params = { statusCode: 500, res, db };
				api.transactions(params);
			});
	},
};
