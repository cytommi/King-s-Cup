const express = require('express');
const redis = require('redis');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const NODE_ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
	path: path.join(__dirname, `../.env.${NODE_ENV}`)
});

const { SERVER_PORT, REDIS_PORT } = process.env;
const redisClient = redis.createClient(REDIS_PORT);

const setupServer = async () => {
	const app = express();
	app.set('view engine', 'pug');
	app.set('views', path.join(__dirname, `../dist`));
	app.use(express.static(path.join(__dirname, '../dist'), { index: false }));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	app.get('*', async (req, res) => {
		res.render('base.pug');
	});

	let server;
	if (NODE_ENV === 'production') {
		console.log('Not yet, man.');
	} else {
		server = http.createServer(app);
		const io = socketIO(server);
		io.redisClient = redisClient;
		require('./io-handler')(io);
		server.listen(SERVER_PORT, () => console.log(`King's Cup server listening on ${SERVER_PORT}`));
	}
};

setupServer();
