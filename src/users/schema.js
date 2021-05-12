module.exports = {
	createUserSchema: {
		type: 'object',
		properties: {
			first_name: { type: 'string', minLength: 2, maxLength: 50 },
			contact: { type: 'string', minLength: 10, pattern: '^[0-9-+()]+$' },
			last_name: { type: 'string', minLength: 2, maxLength: 50 },
			email: {},
			password: { type: 'string' },
			// contact: { type: 'string', minLength: 15, pattern: '^[0-9-+()]+$' },
		},
		additionalProperties: false,
		required: ['first_name', 'contact', 'last_name', 'email', 'password'],
	},
	getUserAgent: {
		type: 'object',
		properties: {
			id:{type:'string',maxLength:36},
			first_name: { type: 'string', minLength: 2, maxLength: 50 },
			contact: { type: 'string', minLength: 10, pattern: '^[0-9-+()]+$' },
			last_name: { type: 'string', minLength: 2, maxLength: 50 },
			email: {},
			role:{type:'string'},
            password: { type: 'string' },
             page:{type:"number"},
            limit:{type:"number"}
		},
		additionalProperties: false,
	},
	/*
     "first_name":"hh",
    "last_name":"pp",
    "contact":"pop",
    "email":"nn",
    "password":"1111111111111"

    getAgentSchema: {
		type: 'object',
		properties: {
			id: { type: 'string', maxLength: 36 },
			first_name: { type: 'string', minLength: 2, maxLength: 50 },
			contact: { type: 'string', minLength: 15, pattern: '^[0-9-+()]+$' },
			email: {},
			status: { type: 'string', minLength: 4 },
			market_id: { type: 'string', pattern: '^[0-9-+()]+$' },
			rating_id: { type: 'string', pattern: '^[0-9-+()]+$' },
			state_id: { type: 'string', pattern: '^[0-9-+()]+$' },
			page: { type: 'number' },
			limit: { type: 'number' },
		},
		additionalProperties: false,
	},


    */
};
