const express = require('express');
const cors = require('cors');
const redis = require('async-redis');
// const redis = require('redis');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const NODE_ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
	path: path.join(__dirname, `../.env.${NODE_ENV}`)
});

const { SERVER_PORT, REDIS_PORT } = process.env;

const setupServer = async () => {
	const app = express();
	app.use(cors());
	app.set('view engine', 'pug');
	app.set('views', path.join(__dirname, `../dist`));
	app.use(express.static(path.join(__dirname, '../dist')));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(express.json());

	app.redisClient = redis.createClient(REDIS_PORT);
	app.redisClient.on('ready', () => {
		console.log('Redis Connected!');
	});

	app.redisClient.on('error', (err) => {
		console.log(err);
		process.exit(-1);
	});

	/** Import api endpoints */
	require('./api')(app);

	app.get('*', async (req, res) => {
		res.render('base.pug');
	});

	let server;
	if (NODE_ENV === 'production') {
		console.log('Not yet, man.');
	} else {
		server = http.createServer(app);
		const io = socketIO(server);
		app.io = io;
		require('./io-handler')(app);
		server.listen(SERVER_PORT, () => console.log(`King's Cup server listening on ${SERVER_PORT}`));
	}
};

setupServer();
