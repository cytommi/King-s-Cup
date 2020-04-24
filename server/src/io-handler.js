const EventTypes = require('../../shared/EventTypes');

let tmpStore = {
	existingGames: []
};

module.exports = (io) => {
	io.on('connection', (socket) => {
		
		/** Client creates game */
		socket.on(EventTypes.client.CREATE_GAME, (customCode) => {
			console.log(`new game room created: ${customCode}`);
			socket.join(`${customCode}`);
		});

		/** Client joins game */
		socket.on(EventTypes.client.JOIN_GAME, (joinCode) => {
			io.redisClient.get(joinCode, (err, data) => {
				
			})
			socket.join(joinCode);
			console.log(`new member in: ${joinCode}`);
			socket.broadcast.emit(EventTypes.server.BROADCAST.NEW_MEMBER, `New member has arrived on ${new Date()}`);
		});

		socket.on(EventTypes.client.INFO_RESPONSE, userInfo => console.log(userInfo))
	});
};
