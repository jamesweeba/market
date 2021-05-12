const pg = require('pgconnect-lite');
const controller = require('./controller');
const api = require('../api/api');

module.exports = {
	getMarkets: (req, res) => {
		pg.connect()
			.then((client) => {
				let payload = req.query;
				if (!payload['page']) {
					payload['page'] = 0;
				}
				if (!payload['limit']) {
					payload['limit'] = 100;
				}
				controller
					.getMarkets(client, payload)
					.then((result) => {
						let params = { statusCode: 200, res, client, result };
						if (result.items.length == 0) {
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
	createMarket: (req, res) => {
		pg.connect()
			.then((client) => {
				let payload = req.body;
				controller
					.createMarket(client, payload)
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
	getMarket: (req, res) => {
		pg.connect()
			.then((client) => {
				let marketId = { id: req.params.id };
				controller
					.getMarket(client, marketId)
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
	},
	updateMarket: (req, res) => {
		pg.connect()
			.then((client) => {
				let payload = req.body;
				payload.id = req.params.id;
				controller
					.updateMarket(client, payload)
					.then(() => {
						let marketId = { id: payload.id };
						return controller.getMarket(client, marketId); 
					})
					.then((result) => {
						let params = { statusCode: 200, res, client, result };
						if (result.items.length == 0) {
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
