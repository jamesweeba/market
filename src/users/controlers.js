let sqlcall = require('../utils/calls');
const pg = require('pgconnect-lite');
const schema = require('./schema');
const validations = require('../utils/validation').validate;

module.exports = {
	createUsers: function (userPaylaod) {
		return new Promise((resolve, reject) => {
			let dbConnection = userPaylaod.client;
			delete userPaylaod.client;

			let createUserSchema = schema.createUserSchema;
			let status = validations(createUserSchema, userPaylaod);

			if (!status.isValid) {
				return resolve({ statusCode: 400, message: status.err.errors });
			}
			let payload = {
				action: 'create',
				fields: [...Object.keys(userPaylaod)],
				table: 'users',
			};
			let sql = sqlcall.sqlCalls(payload);
			let params = payload.fields.map((field) => userPaylaod[field] != null && userPaylaod[field]);
			pg.insert(dbConnection, sql, params)
				.then((user) => {
					return resolve(user.data);
				})
				.catch((err) => {
					console.log(err);
					return reject(err);
				});
		});
	},
	fetchUsers: function (client, userPaylaod) {
		return new Promise((resolve, reject) => {
			let getUserAgent = schema.getUserAgent;
			let status = validations(getUserAgent, userPaylaod);
			if (!status.isValid) {				
				return resolve({ statusCode: 400, message: status.err.errors });
			}
			//getUserAgent
			let payload = {
				action: 'fetch',
				filters: [...Object.keys(userPaylaod)],
				table: 'users',
			};
			let sql = sqlcall.sqlCalls(payload);
			let params = payload.filters.map((field) => userPaylaod[field]);
			pg.fetch(client, sql, params)
				.then((results) => {
					results.data.items.map(row=>delete row.password && row);
					return resolve(results.data);
				})
				.catch((err) => {
					return reject(err);
				});
		});
	},
	user: function (client, userId) {
		return new Promise((resolve, reject) => {
			let payload = {
				action: 'fetchOne',
				filters: [Object.keys(userId)],
				table: 'users',
			};
			let sql = sqlcall.sqlCalls(payload);
			let params = payload.filters.map((field) => userId[field]);
			pg.fetchOne(client, sql, params)
				.then((result) => {
					return resolve(result.data);
				})
				.catch((err) => {
					return reject(err);
				});
		});
	},
	updateUser: function (client, userPaylaod) {
		return new Promise((resolve, reject) => {
			let payload = {
				action: 'update',
				fields: [...Object.keys(userPaylaod).filter((field) => field != 'id')],
				table: 'users',
			};
			let sql = sqlcall.sqlCalls(payload);
			let params = payload.fields.map((field) => userPaylaod[field]);
			params.push(userPaylaod.id);
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
