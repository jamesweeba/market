let sqlcall = require('../utils/calls');
const pg = require('pgconnect-lite');

module.exports = {
	createState: function (client, param) {
		return new Promise((resolve, reject) => {
			let payload = {
				action: 'create',
				fields: [...Object.keys(param)],
				table: 'states',
			};
			let sql = sqlcall.sqlCalls(payload);
			let params = payload.fields.map((field) => param[field] != null && param[field]);
			pg.insert(client, sql, params)
				.then((state) => {
					return resolve(state.data);
				})
				.catch((err) => {
					console.log(err);
					return reject({ statusCode: 500, message: 'Internal server error' });
				});
		});
	},
	getState: function (client, param) {
		return new Promise((resolve, reject) => {
			let payload = {
				action: 'fetchOne',
				filters: [...Object.keys(param)],
				table: 'states',
			};
			let sql = sqlcall.sqlCalls(payload);
			let params = payload.filters.map((field) => param[field] != null && param[field]);
			pg.fetch(client, sql, params)
				.then((result) => {
					return resolve(result.data);
				})
				.catch((err) => {
					console.log(err);
					return reject(err);
				});
		});
	},
	updateState: function (client, param) {
		return new Promise((resolve, reject) => {
			let payload = {
				action: 'update',
				fields: [...Object.keys(param).filter((field) => field != 'id')],
				table: 'states',
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
	getAllStates: function (client, param) {
		return new Promise((resolve, reject) => {
			let payload = {
				action: 'fetch',
				filters: [...Object.keys(param)],
				table: 'states',
			};
			let sql = sqlcall.sqlCalls(payload);
			let params = payload.filters
				.map((field) => field != 'page' && field != 'limit' && param[field])
				.filter((field) => field != false);
			params.push(param['page']);
			params.push(param['limit']);
			pg.fetch(client, sql, params)
				.then((results) => {
					return resolve(results.data);
				})
				.catch((err) => {
					console.log(err);
					return reject(err);
				});
		});
	},
};
