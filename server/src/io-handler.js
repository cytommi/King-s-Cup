const EventTypes = require('../../shared/EventTypes');

module.exports = (app) => {
	app.io.on('connection', (socket) => {
		console.log('Client connected');

		socket.on(EventTypes.client.JOIN_GAME, async ({ name, room }) => {
			socket.join(room);
			const players = await app.redisClient.lrange(`${room}:players`, 0, -1);
			console.log({players})
			socket.broadcast.emit(EventTypes.server.BROADCAST.NEW_MEMBER, {
				message: `${name} has just joined the room : ${room}`,
				payload: players
			});
		});
		// /** Client creates game */
		// socket.on(EventTypes.client.CREATE_GAME, (customCode) => {
		// 	io.redisClient.exists(customCode, (err, res) => {
		// 		if (err) throw new Error(err);
		// 		if (res === 1) {
		// 			console.log(`Attempt to create room with existing code: ${customCode}`);
		// 			socket.emit(
		// 				EventTypes.server.ERROR.DUPLICATE_CUSTOM_CODE,
		// 				`Custom code: ${customCode} already exists`
		// 			);
		// 		} else {
		// 			// io.redisClient.setex(customCode, []);
		// 			// socket.join(`${customCode}`);
		// 			socket.emit(EventTypes.server.CREATE_GAME_SUCCESS);
		// 			console.log(`new game room created: ${customCode}`);
		// 		}
		// 	});
		// });

		/** Client joins game */
		// socket.on(EventTypes.client.JOIN_GAME, (joinCode) => {
		// 	io.redisClient.get(joinCode, (err, data) => {
		// 		if (err) throw new Error(err);
		// 		if (data) {
		// 			console.log(data);
		// 			socket.join(joinCode);
		// 			socket.broadcast.emit(
		// 				EventTypes.server.BROADCAST.NEW_MEMBER,
		// 				`New member has arrived in room: ${joinCode} on ${new Date()}`
		// 			);
		// 			console.log(`new member in: ${joinCode}`);
		// 		} else {
		// 			socket.emit(EventTypes.server.ERROR.INVALID_JOIN_CODE, `Invalid Join Code`);
		// 		}
		// 	});
		// });

		// socket.on(EventTypes.client.INFO_RESPONSE, (userInfo) => console.log(userInfo));
		socket.on('disconnect', () => console.log('client disconnected'));
	});
};
