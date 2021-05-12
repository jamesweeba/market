let sqlcall = require('../utils/calls');
const pg = require('pgconnect-lite');

module.exports = {
	getMarkets: (client, param) => {
		return new Promise((resolve, reject) => {
			let payload = {
				action: 'fetch',
				filters: [...Object.keys(param)],
				table: 'markets',
			};
			let sql = sqlcall.sqlCalls(payload);
			param['page'] === 1 ? 0 : param['page'];
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
	createMarket: (client, param) => {
		return new Promise((resolve, reject) => {
			let payload = {
				action: 'create',
				fields: [...Object.keys(param)],
				table: 'markets',
			};

			let sql = sqlcall.sqlCalls(payload);
			let params = payload.fields.map((field) => param[field] != null && param[field]);
			pg.insert(client, sql, params)
				.then((user) => {
					return resolve(user.data);
				})
				.catch((err) => {
					console.log(err);
					return reject(err);
				});
		});
	},

	getMarket: (client, param) => {
		return new Promise((resolve, reject) => {
			let payload = {
				action: 'fetchOne',
				filters: [...Object.keys(param)],
				table: 'markets',
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

	updateMarket: (client, param) => {
		return new Promise((resolve, reject) => {
			let payload = {
				action: 'update',
				fields: [...Object.keys(param).filter((field) => field != 'id')],
				table: 'markets',
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
};
