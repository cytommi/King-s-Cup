const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const NODE_ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
	path: path.join(__dirname, `../.env.${NODE_ENV}`)
});

const setupServer = async () => {
	const app = express();
	app.set('view engine', 'pug');
	app.set('views', path.join(__dirname, `../dist`));
	app.use(express.static(path.join(__dirname, '../dist'), { index: false }));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	try {
		const mongoOptions = {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true
		};
		mongoose.set('useNewUrlParser', true);
		mongoose.set('useFindAndModify', false);
		mongoose.set('useCreateIndex', true);
		mongoose.set('useUnifiedTopology', true);
		await mongoose.connect(process.env.MONGO_URL, mongoOptions);
		console.log('Connected to MongoDB.');
	} catch (err) {
		console.log(err);
		process.exit(-1);
	}

	app.get('*', async (req, res) => {
		res.render('base.pug');
	});

	let server;
	if (NODE_ENV === 'production') {
		console.log('Not yet, man.');
	} else {
		server = http.createServer(app);
		const io = socketIO(server);
		require('./io-handler')(io);
		server.listen(process.env.PORT, () => console.log(`King's Cup server listening on ${process.env.PORT}`));
	}
};

setupServer();
