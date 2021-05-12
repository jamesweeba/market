module.exports = {
	signupSchema: {
		type: 'object',
		properties: {
			first_name: { type: 'string', minLength: 2, maxLength: 50 },
			last_name: { type: 'string', minLength: 2, maxLength: 50 },
			email: { type: 'string', minLength: 2,},
			password: { type: 'string', minLength: 6 },
			contact: { type: 'string', minLength: 2, maxLength: 15, pattern: '^[0-9-+()]+$' },
			role:{type:'string',minLength: 2, maxLength: 50}
		},
		additionalProperties: true,
		required: ['first_name', 'last_name', 'email', 'contact', 'password'],
	},
};
