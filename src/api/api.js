const pg = require('pgconnect-lite');
module.exports = {
	transactions: function (params) {
		let { statusCode, res, client, result } = params;

		switch (statusCode) {
			case 200:
				res.status(statusCode).json(result);
				pg.commit(client);
				break;
			case 404:
				res.status(statusCode).json(result ? result : 'NOT FOUND');
				pg.commit(client);
				break;
			case 400:
				res.status(statusCode).json(result);
				pg.rollback(client);
				break;
			case 500:
				res.status(statusCode).json( result ? result :'INTERNAL SERVER ERROR');
				pg.rollback(client);
				break;

			default:
				res.status(statusCode).json('INTERNAL SERVER ERROR');
				pg.rollback(client);
		}
	},
};
