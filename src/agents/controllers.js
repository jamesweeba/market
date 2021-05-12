const pg = require('pgconnect-lite');
let sqlcall = require('../utils/calls');
const validations = require('../utils/validation').validate;
const schema = require('./schema');

module.exports = {
	createAgent: (client, param) => {},

	getAgents: (client, param) => {
		return new Promise((resolve, reject) => {
			let getAgent = schema.getAgentSchema;
			let status = validations(getAgent, param);
			if (!status.isValid) {
				return resolve({ statusCode: 400, message: status.err.errors });
			}
			param['page'] === 1 ? 0 : param['page'];
			let payload = {
				action: 'fetch',
				filters: [...Object.keys(param)],
				table: 'agents',
			};
			let sql = sqlcall.sqlCalls(payload);

			let params = payload.filters.map((field) => param[field] != null && param[field]);
			pg.fetch(client, sql, params)
				.then((result) => {
					return resolve(result.data);
				})
				.catch((err) => {
					return reject(err);
				});
		});
	},

	updateAgent: (client, param) => {
		return new Promise((resolve, reject) => {
			let updateAgentShema = schema.updateAgentSChema;
			let status = validations(updateAgentShema, param);

			if (!status.isValid) {
				return resolve({ statusCode: 400, message: status.err.errors });
			}
			let payload = {
				action: 'update',
				fields: [...Object.keys(param).filter((field) => field != 'id')],
				table: 'agents',
			};
			let sql = sqlcall.sqlCalls(payload);

			let params = payload.fields.map((field) => param[field]);
			params.push(param.id);
			pg.update(client, sql, params)
				.then((result) => {
					return resolve(result.data);
				})
				.catch((err) => {
					console.log(err);
					return reject(err);
				});
		});
	},

	anAgent: (client, param) => {
		return new Promise((resolve, reject) => {
			let getAgent = schema.getAngentSchema;
			let status = validations(getAgent, param);
			if (!status.isValid) {
				return resolve({ statusCode: 400, message: status.err.errors });
			}
			let payload = {
				action: 'fetchOne',
				filters: [...Object.keys(param)],
				table: 'agents',
			};
			let sql = sqlcall.sqlCalls(payload);
			let params = payload.filters.map((field) => param[field] != null && param[field]);

			pg.fetch(client, sql, params)
				.then((result) => {
					return resolve(result.data);
				})
				.catch((err) => {
					return reject(err);
				});
		});
	},

	getAgentOrders: (client, param) => {
		return new Promise((resolve, reject) => {
			//updateAgentSChema

			let getAgentOrders = schema.agentOrdersSchema;
			let status = validations(getAgentOrders, param);
			if (!status.isValid) {
				
				return resolve({ statusCode: 400, message: status.err.errors });
			}

			let payload = {
				action: 'fetch',
				filters: [...Object.keys(param)],
				table: 'request',
			};
			let sql = sqlcall.sqlCalls(payload);
			let params = payload.filters.map(
				(field) => param[field] != null && field != 'limit' && field != 'page' && param[field]
			);
			let finalParams = params.filter((item) => item != false);
			finalParams.push(param['page']);
			finalParams.push(param['limit']);
			pg.fetch(client, sql, finalParams)
				.then((result) => {
					return resolve(result.data);
				})
				.catch((err) => {
					return reject(err);
				});
		});
	},
};
