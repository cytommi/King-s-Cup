const { CardDeck } = require('./utilities');

module.exports = (app) => {
	/** Client checking if a room code exists, or if name conflicts with existing players */
	app.head('/api/game/:code/:name', async (req, res) => {
		const roomCode = req.params.code;
		const name = req.params.name;
		try {
			const players = await app.redisClient.lrange(`${roomCode}:players`, 0, 0);
			if (players) {
				players.forEach((player) => {
					if (player === name) return res.status(409);
				});
				return res.status(204).send();
			} else return res.status(404).send();
		} catch (err) {
			return res.status(400).send({ error: err });
		}
	});

	/**
     * @description Client creates game
     * @param {req.body.customCode}
     * @param {req.body.name}
     */
	app.post('/api/game', async (req, res) => {
		const { customCode } = req.body;
		try {
			/** Check if room code conflicts */
			const players = await app.redisClient.lrange(`${customCode}:players`, 0, -1);
			if (players.length > 0) {
				return res.status(409).send({ error: `Attempt to create room with existing code: ${customCode}` });
			}

			/** Initialize members list */
			await app.redisClient.rpush(`${customCode}:players`, `INIT_PLACEHOLDER`);

			/** Initialize card deck */
			await app.redisClient.rpush(`${customCode}:cards`, ...CardDeck());
			res.status(201).send();
		} catch (err) {
			res.status(400).send({ error: err });
		}
	});

	/** Client joins game */
	app.put('/api/game/:code', async (req, res) => {
		const { name } = req.body;
		const roomCode = req.params.code;
		try {
			let players = await app.redisClient.lrange(`${roomCode}:players`, 0, -1);
			await app.redisClient.rpush(`${roomCode}:players`, name);
			if (players[0] === `INIT_PLACEHOLDER`) await app.redisClient.lpop(`${roomCode}:players`);

			players = await app.redisClient.lrange(`${roomCode}:players`, 0, -1);
			const currentDeck = await app.redisClient.lrange(`${roomCode}:cards`, 0, -1);

			return res.status(201).send({
				players,
				currentDeck
			});
		} catch (err) {
			return res.status(400).send({ error: err });
		}
	});
};
