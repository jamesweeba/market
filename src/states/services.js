let controller = require('./controller');
const pg = require('pgconnect-lite');
const api = require('../api/api');

module.exports = {
	createState: function (req, res) {
		pg.connect()
			.then((client) => {
				let param = req.body;
				controller
					.createState(client, param)
					.then((result) => {
						let params = { statusCode: 200, res, client, result };
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
	},

	getAState: function (req, res) {
		pg.connect()
			.then((client) => {
				let param = req.params;
				controller
					.getState(client, param)
					.then((result) => {
						let params = { statusCode: 200, res, client, result };
						if (result.count == 0) {
							params = { statusCode: 404, res, client };
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
	},

	update: function (req, res) {
		pg.connect()
			.then((client) => {
				let param = req.body;
				param.id = req.params.id;
				controller
					.updateState(client, param)
					.then(() => {
						let param = req.params;
						return controller.getState(client, param);
					})
					.then((result) => {
						let params = { statusCode: 200, res, client, result };
						if (result.count == 0) {
							params = { statusCode: 404, res, client };
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
	},

	getStates: function (req, res) {
		pg.connect()
			.then((client) => {
				let param = req.query;
				// let userObject = req.query;
				if (!param['page']) {
					param['page'] = 0;
				}
				if (!param['limit']) {
					param['limit'] = 100;
				}
				controller
					.getAllStates(client, param)
					.then((result) => {
						let params = { statusCode: 200, res, client, result };
						if (result.count == 0) {
							params = { statusCode: 404, res, client };
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
	},
};
