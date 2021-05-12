let sqlcall = require('../utils/calls');
const pg = require('pgconnect-lite');
const { ordersSchema } = require('./schema');
const validations = require('../utils/validation').validate;

module.exports = {
	orders: function (client, data) {
		return new Promise((resolve, reject) => {
			let status = validations(ordersSchema, data);
			if (!status.isValid) {
				return reject({ statusCode: 400, message: status.err.errors });
			}
			data.request = JSON.stringify(data.request);
			let payload = {
				action: 'create',
				fields: [...Object.keys(data)],
				table: 'request',
			};
			let sql = sqlcall.sqlCalls(payload);
			let params = payload.fields.map((field) => data[field] != null && data[field]);
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

	getOrders: (client, data) => {
		return new Promise((resolve, reject) => {
			let payload = {
				action: 'fetch',
				filters: [...Object.keys(data)],
				limit: data.limit,
				offset: data.page,
				table: 'request',
			};

			let sql = sqlcall.sqlCalls(payload);
			let newFileds = payload.filters.filter((field) => field != 'limit' && field != 'page');
			let params = newFileds.map((field) => data[field] != null && data[field]);
			params.push(parseInt(data.limit));
			params.push(_offset(data));

			pg.fetch(client, sql, params)
				.then((orders) => {
					if (orders.data.count == 0) {
						return resolve({ statusCode: 404 });
					}
					return resolve(orders.data);
				})
				.catch((err) => {
					return reject(err);
				});
		});
	},

	anOrder: (client, data) => {
		return new Promise((resolve, reject) => {
			let payload = {
				action: 'fetchOne',
				filters: [...Object.keys(data)],
				table: 'request',
			};

			let sql = sqlcall.sqlCalls(payload);
			let params = payload.filters.map((field) => data[field] != null && data[field]);
			pg.fetchOne(client, sql, params)
				.then((result) => {
					if (!result.data) {
						return resolve({ statusCode: 404 });
					}
					return resolve(result.data);
				})
				.catch((err) => {
					return reject(err);
				});
		});
	},
	updateOrder(client, data) {
		return new Promise((resolve, reject) => {
			let payload = {
				action: 'update',
				id: data.id,
				fields: [...Object.keys(data).filter((field) => field != 'id' && field)],
				table: 'request',
			};
			let sql = sqlcall.sqlCalls(payload);
			let params = payload.fields.map((field) => data[field] != null && data[field]);
			params.push(payload.id);
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

function _offset(paylaod) {
	if (parseInt(paylaod.page) < 0 || parseInt(paylaod.page) == 0) {
		paylaod.page = 1;
	}
	let offset = (parseInt(paylaod.page) - 1) * 100;
	console.log(paylaod.page);
	return offset;
}
