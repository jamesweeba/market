let sqlcall = require('../utils/calls');
const pg = require('pgconnect-lite');
const base64 = require('base-64');
const validations = require('../utils/validation').validate;
const schema = require('./schema');
const { hashUserPassword, jwtGenerator, msisdnValidator } = require('../utils/commons');
const bcrypt = require('bcrypt');

module.exports = {
	login: function (client, data) {
		return new Promise((resolve, reject) => {
			let encryptedAuth = data.authorization;
			let splitEncryption = encryptedAuth.split(' ')[1];
			let emailAndPassword = base64.decode(splitEncryption).split(':');
			let userName = emailAndPassword[0];
			let password = emailAndPassword[1];
			data.userName = userName;
			data.password = password;
			delete data.authorization;
			validateEmail(client, data)
				.then((result) => {
					let param = { password: data.password, result };
					return validateDatePassword(param);
				})
				.then((result) => {
					let token = jwtGenerator(result);
					return resolve({ ...result, jwtToken: token });
				})
				.catch((err) => {
					return reject(err);
				});
		});
	},

	signup: function (client, data) {
		return new Promise((resolve, reject) => {
			let signupSchema = schema.signupSchema;
			let status = validations(signupSchema, data);
			if (!status.isValid) {
				return resolve({ statusCode: 400, message: status.err.errors });
			}
			let password = hashUserPassword(data.password);
			let contact = msisdnValidator(data.contact);
			if (contact.errors) {
				return resolve({ statusCode: 400, ...contact.errors });
			}

			data.password = password;
			data.contact = contact.substring(1);
			let userFilter = Object.keys(data).filter((fields) => fields != 'market_id' && fields);

			let payload = {
				action: 'create',
				fields: [...userFilter],
				table: 'users',
			};
			let sql = sqlcall.sqlCalls(payload);
			let params = payload.fields.map((field) => data[field] != null && data[field]);
			pg.insert(client, sql, params)
				.then((user) => {
					delete user.data['items'][0].password;
					let output = user.data;
					let token = jwtGenerator(user.data['items'][0]);
					return resolve({ ...output, jwtToken: token });
				})
				.catch((err) => {
					console.log(err);
					return reject(err);
				});
		});
	},
	createAgent: function (data) {
		return new Promise((resolve, reject) => {
			let { payload, client, result } = data;
			payload.contact = '+'.concat(payload.contact);
			let contact = msisdnValidator(payload.contact);
			if (contact.errors) {
				return resolve({ statusCode: 400, ...contact.errors });
			}
			let agentsFilter = Object.keys(payload).filter(
				(fields) => fields != 'password' && fields != 'role' && fields
			);
			let agents = {
				action: 'create',
				fields: [...agentsFilter],
				table: 'agents',
			};

			let sql = sqlcall.sqlCalls(agents);
			payload.contact = payload.contact.substring(1);
			let params = agents.fields.map((field) => payload[field] != null && payload[field]);
			pg.insert(client, sql, params)
				.then((agents) => {
					return resolve(result);
				})
				.catch((err) => {
					return reject(err);
				});
		});
	},
};

function validateEmail(client, data) {
	return new Promise((resolve, reject) => {
		let payload = {
			action: 'fetchLogin',
			fields: ['password,first_name,last_name,contact,email'],
			table: 'users',
			filters: ['email'],
		};
		if (data['userName'].indexOf('@') == -1) {
			payload['filters'] = ['contact'];
		}
		let sql = sqlcall.sqlCalls(payload);
		let params = [data.userName];

		pg.fetchOne(client, sql, params)
			.then((results) => {
				return resolve(results.data);
			})
			.catch((err) => {
				return reject(err);
			});
	});
}

function validateDatePassword(param) {
	return new Promise((resolve, reject) => {
		let { password, result } = param;
		if (!result) {
			return resolve(null);
		}
		let passwordMatch = bcrypt.compareSync(password, result.password);
		if (!passwordMatch) {
			return resolve(null);
		}
		delete result.password;
		return resolve(result);
	});
}
