const pg = require('pgconnect-lite');
const controller = require('./controlers');
const api = require('../api/api');

let users = function (req, res) {
	pg.connect()
		.then((client) => {
			let userObject = req.body;
			userObject['client'] = client;
			controller
				.createUsers(userObject)
				.then((result) => {
					let params = { statusCode: 200, res, client, result };
					if (result.statusCode == 400) {
						params = { statusCode: 400, res, client, result: result.message  };
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
			let params = { statusCode: 500, res, client };
			api.transactions(params);
		});
};

let fetchusers = function (req, res) {
	pg.connect()
		.then((client) => {
			let userObject = req.query;
			if (!userObject['page']) {
				userObject['page'] = 0;
			}
			if (!userObject['limit']) {
				userObject['limit'] = 100;
			}
			controller
				.fetchUsers(client, userObject)
				.then((result) => {
					let params = { statusCode: 200, res, client, result };
					if(result.count==0){
						 params = { statusCode: 404, res, client };

					}
					if(result.statusCode==400){
						params = { statusCode: 400, res, client,result: result.message  };

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

			let params = { statusCode: 500, res, client };
			api.transactions(params);
		});
};
let user = function (req, res) {
	pg.connect()
		.then((client) => {
			let userId = { id: req.params.id };
			controller
				.user(client, userId)
				.then((result) => {
					let params = { statusCode: 200, res, client, result };
					if (result == null) {
						params = { statusCode: 404, res, client, result };
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
			let params = { statusCode: 500, res, client };
			api.transactions(params);
		});
};

let updateUser = function (req, res) {
	pg.connect()
		.then((client) => {
			let userPayload = req.body;
			userPayload.id = req.params.id;
			controller
				.updateUser(client, userPayload)
				.then(() => {
					let userId = { id: userPayload.id };
					return controller.user(client, userId);
				})
				.then((result) => {
					delete result.password;
					let params = { statusCode: 200, res, client, result };
					if (result == null) {
						params = { statusCode: 404, res, client, result };
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
			let params = { statusCode: 500, res, client };
			api.transactions(params);
		});
};

module.exports = {
	users,
	fetchusers,
	user,
	updateUser,
};
