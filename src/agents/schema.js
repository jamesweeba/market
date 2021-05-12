module.exports = {
	createAgentSchema: {
		type: 'object',
		properties: {},
	},

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

	getAngentSchema: {
		type: 'object',
		properties: {
			id: { type: 'string', maxLength: 36 },
		},
		additionalProperties: false,
		required: ['id'],
	},

	updateAgentSChema: {
		type: 'object',
		properties: {
			id: { type: 'string', maxLength: 36 },
			first_name: { type: 'string', minLength: 2, maxLength: 50 },
			contact: { type: 'string', minLength: 15, pattern: '^[0-9-+()]+$' },
			last_name: { type: 'string', minLength: 2, maxLength: 50 },
			email: { type: 'string' },
			status: { type: 'string', minLength: 4 },
			market_id: { type: 'string', pattern: '^[0-9-+()]+$' },
			rating_id: { type: 'string', pattern: '^[0-9-+()]+$' },
			state_id: { type: 'string', pattern: '^[0-9-+()]+$' },
		},
		additionalProperties: false,
		required: ['id'],
	},

	agentOrdersSchema: {
		type: 'object',
		properties: {
			agent_id: { type: 'string', maxLength: 36 },
			page: { type: 'number', pattern: '^[0-9-+()]+$' },
			limit: { type: 'number', pattern: '^[0-9-+()]+$' },
		},
		additionalProperties: false,
		required: ['agent_id'],
	},
};
