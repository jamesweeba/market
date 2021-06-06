const controller = require('./controllers');
const pg = require('pgconnect-lite');
const api = require('../api/api');
const agent = require('../agents/controllers');

module.exports = {
	createOrder: (req, res) => {
		pg.connect()
			.then((client) => {
				let data = req.body;
				data.user_id = req.user.id;
				controller
					.orders(client, data)
					.then((result) => {
						data['result'] = result;
						let agentParam = {
							market_id: parseInt(result['items'][0].market),
							state_id: 3,
							page: 0,
							limit: 1000,
						};
						return agent.getAgents(client, agentParam);
					})
					.then((agent) => {
						if(agent.count==0){
								params = { statusCode: 404, res, client, result: "NO AGENTS FOR SELECT MARKETS" };
							api.transactions(params);
							return
						}
						let { result } = data;
						let total = agent.count;
						let random = Math.ceil(Math.random() * total);
						let agentId = { agent_id: agent['items'][random - 1].id, id: result['items'][0].id };
						data['agent'] = agent['items'][random - 1];
						return controller.updateOrder(client, agentId);
					})
					.then(() => {
						let gold = 2;
						let param = { state_id: gold, id: data['agent'].id };
						return agent.updateAgent(client, param);
					})
					.then(() => {
						let { result } = data;
						let orderId = { id: result['items'][0].id };
						return controller.anOrder(client, orderId);
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
						if (err.statusCode == 400) {
							params = { statusCode: 400, res, client, result: err.message };
						}
						api.transactions(params);
					});
			})
			.catch((err) => {
				console.log(err);
				let params = { statusCode: 500, res, client };
				api.transactions(params);
			});
	},

	anOrder: (req, res) => {
		pg.connect()
			.then((client) => {
				let payload = req.params;
				controller
					.anOrder(client, payload)
					.then((result) => {
						let params = { statusCode: 200, res, client, result };
						if (result.statusCode == 400) {
							params = { statusCode: 400, res, client, result: result.message };
						}
						if (result.statusCode == 404) {
							params = { statusCode: 404, res, client, result: result.message };
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

	getOrders: (req, res) => {
		pg.connect()
			.then((client) => {
				let payload = req.query;
				controller
					.getOrders(client, payload)
					.then((result) => {
						let params = { statusCode: 200, res, client, result };
						if (result.statusCode == 400) {
							params = { statusCode: 400, res, client, result: result.message };
						}
						if (result.statusCode == 404) {
							params = { statusCode: 404, res, client, result: result.message };
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

	updateOrder: (req, res) => {
		pg.connect()
			.then((client) => {
				let data = req.body;
				data.id = req.params.id;
				controller
					.updateOrder(client, data)
					.then((result) => {
						let payload = req.params;
						return controller.anOrder(client, payload);
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
				let params = { statusCode: 500, res, client };
				api.transactions(params);
			});
	},

	declineOrder: (req, res) => {
		pg.connect()
			.then((client) => {
				let data = req.body;
				data.id = req.params.id;
				controller
					.updateOrder(client, data)
					.then((result) => {
						let payload = req.params;
						return controller.anOrder(client, payload);
					})
					.then((result) => {
						data['result'] = result;
						let params = {
							state_id: 3,
							id: result.agent_id,
						};

						return agent.updateAgent(client, params);
					})
					.then(() => {
						let { result } = data;
						let agentParam = { market_id: parseInt(result.market), state_id: 3, page: 0, limit: 1000 };
						return agent.getAgents(client, agentParam);
					})
					.then((agents) => {
						let total = agents.count;
						let random = Math.ceil(Math.random() * total);
						let data = {
							id: req.params.id,
							agent_id: agents.items[random - 1].id,
						};
						let gold = 2;
						let param = {
							id: data['agent_id'],
							state_id: gold,
						};
						agent.updateAgent(client, param);
						return controller.updateOrder(client, data);
					})
					.then(() => {
						let payload = req.params;
						return controller.anOrder(client, payload);
					})
					.then((result) => {
						let params = { statusCode: 200, res, client, result };
						if (result.statusCode == 400) {
							params = { statusCode: 400, res, client, result: result.message };
						}
						if (result.statusCode == 404) {
							params = { statusCode: 404, res, client, result: result.message };
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
