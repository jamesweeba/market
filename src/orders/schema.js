module.exports = {
	ordersSchema: {
		type: 'object',
		properties: {
			user_id: { type: 'string', minLength: 2, maxLength: 50 },
			request: { type: 'array'},
			status: { type: 'string', minLength: 2,},
			market: { type: 'number', minLength: 6 },
		},
		additionalProperties: false,
		required: ['user_id', 'request', 'status', 'market'],
	},
};
