module.exports = {
	sqlCalls: function (paylaod) {
		let { action, fields, table, filters, limit, offset } = paylaod;
		switch (action) {
			case 'fetch':
				let newFileds = filters.filter((field) => field != 'limit' && field != 'page');
				return newFileds.length > 0
					? `select  * from ${table} where ${newFileds
							.map((field, index) => field + '=' + '$' + (index + 1) + ' ')
							.join('and ')} offset $${newFileds.length + 1}  limit $${newFileds.length + 2};`
					: `select  * from ${table}  offset $1 limit $2`;
			case 'fetchAll':
				return `select some from ${table} where ${column}=something`;
			case 'create':
				return `insert into ${table} (${fields.map((field) => field).join(',')}) values(${fields.map(
					(field, index) => '$' + (index + 1)
				)}) returning  *`;
			case 'fetchOne':
				return `select * from ${table} where ${filters
					.map((field, index) => field + '=' + '$' + (index + 1))
					.join(' and ')}`;

			case 'fetchLogin':
				return `select  ${fields.map((field) => field).join(',')} from ${table} where  ${filters.map(
					(filter, index) => filter + ' = ' + ' $' + (index + 1)
				)}`;

			case `update`:
				return `update 	${table} set ${fields
					.map((field, index) => field + '=' + '$' + (index + 1))
					.join(',')} where id= $${fields.length + 1} `;

			// break;
		}
	},
};
