const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const port = process.env.PORT || 1900;
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const users = require('./users/routes');
const auth = require('./auth/routes');
const orders = require('./orders/routes');
const agents = require('./agents/routers');
const markets = require('./markets/routers');
const state = require('./states/routers');
const morgan = require('morgan');

module.exports = {
	start: function (app) {
		app.use(fileUpload());
		app.use(bodyParser.json({ limit: '50mb' }), bodyParser.urlencoded({ extended: true, limit: '50mb' }));
		app.use(cors());

		var swaggerDefinition = {
			info: {
				title: 'KAYAYO API',
				version: '1.0.0',
				description: 'Demonstrating how to describe a RESTful API with Swagger',
			},
			host: 'localhost:1900',
			basePath: '/',
		};

		var options = {
			// import swaggerDefinitions
			swaggerDefinition: swaggerDefinition,
			// path to the API docs
			apis: ['./users/routes.js','./orders/routes.js'],
		};

		var swaggerSpec = swaggerJSDoc(options);
		app.get('/swagger.json', function (req, res) {
			res.setHeader('Content-Type', 'application/json');
			res.send(swaggerSpec);
		});

		app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
		app.get('/', (req, res) => {
			res.status(400).json({ message: 'API is working' });
		});

		app.listen(port, () => {
			console.log('Magic happens on port' + port);
		});

		app.use(morgan('dev'));
		app.use('/api/v1/users', users);
		app.use('/api/v1/auth', auth);
		app.use('/api/v1/orders', orders);
		app.use('/api/v1/agents', agents);
		app.use('/api/v1/markets', markets);
		app.use('/api/v1/states', state);
	},
};
