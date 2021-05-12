const pg = require('pgconnect-lite');
const controler = require('./controllers');
const api = require('../api/api');

module.exports = {
	createAgent: (req, res) => {
		pg.connect()
			.then((client) => {
				let payload = req.body;
				controler
					.createAgent(client, payload)
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
	getAgents: (req, res) => {
		pg.connect()
			.then((client) => {
				let payload = req.query;
				if (!payload['page']) {
					payload['page'] = 0;
				}
				if (!payload['limit']) {
					payload['limit'] = 100;
				}

				controler
					.getAgents(client, payload)
					.then((result) => {
						let params = { statusCode: 200, res, client, result };

						if (result.statusCode == 400) {
							params = { statusCode: 400, res, client, result: result.message };
						}
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

	updateAgent: (req, res) => {
		pg.connect()
			.then((client) => {
				let payload = req.body;
				payload.id = req.params.id;
				controler
					.updateAgent(client, payload)
					.then((agentUpdate) => {
						if (agentUpdate.statusCode == 400) {
							payload['isValid'] = { statusCode: 400, res, client, result: agentUpdate.message };
						}

						let agentId = { id: payload.id };
						return controler.anAgent(client, agentId);
					})
					.then((result) => {
						let params = { statusCode: 200, res, client, result };
						if (payload['isValid']) {
							if (payload['isValid'].statusCode == 400) params = payload['isValid'];
						}
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

	getAgent: (req, res) => {
		pg.connect()
			.then((client) => {
				let param = req.params;
				controler
					.anAgent(client, param)
					.then((result) => {
						let params = { statusCode: 200, res, client, result };

						if (result.statusCode == 400) {
							params = { statusCode: 400, res, client, result: result.message };
						}
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

	getAgentOrders: (req, res) => {
		pg.connect()
			.then((client) => {
				let payload = req.query;
				payload.agent_id = req.params.id;
				if (!payload['page']) {
					payload['page'] = 0;
				}
				if (!payload['limit']) {
					payload['limit'] = 100;
				}
				controler
					.getAgentOrders(client, payload)
					.then((result) => {
						let params = { statusCode: 200, res, client, result };
						if (result.count == 0) {
							params = { statusCode: 404, res, client };
						}
						if(result.statusCode==400){
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
				let params = { statusCode: 500, res, client };
				api.transactions(params);
			});
	},
};
