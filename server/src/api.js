const { CardDeck } = require("./utilities");

module.exports = (app) => {
  /** Client checking if a room code exists, or if name conflicts with existing players */
  app.head("/api/game/:code/:name", async (req, res) => {
    const roomCode = req.params.code;
    const name = req.params.name;
    try {
      const players = await app.redisClient.lrange(
        `${roomCode}:players`,
        0,
        -1
      );
      if (players.length > 0) {
        if (players.includes(`${name}__M`, `${name}__F`)) {
          return res.status(409).send();
        } else return res.status(204).send();
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
  app.post("/api/game", async (req, res) => {
    const { customCode } = req.body;
    try {
      /** Check if room code conflicts */
      const players = await app.redisClient.lrange(
        `${customCode}:players`,
        0,
        -1
      );
      if (players.length > 0) {
        return res.status(409).send({
          error: `Attempt to create room with existing code: ${customCode}`,
        });
      }

      /** Initialize members list */
      await app.redisClient.rpush(`${customCode}:players`, `INIT_PLACEHOLDER`);

      /** Initialize card deck */
      await app.redisClient.rpush(`${customCode}:cards`, ...CardDeck());
      await app.redisClient.set(`${customCode}:currentPlayer`, 0);
      res.status(201).send();
    } catch (err) {
      res.status(400).send({ error: err });
    }
  });

  /** Client joins game */
  app.put("/api/game/:code", async (req, res) => {
    const { name, gender } = req.body;
    if (!name || !gender) return res.status(401).send();
    const playerName = `${name}__${gender}`;
    const roomCode = req.params.code;
    try {
      let players = await app.redisClient.lrange(`${roomCode}:players`, 0, -1);
      await app.redisClient.rpush(`${roomCode}:players`, playerName);
      if (players[0] === `INIT_PLACEHOLDER`)
        await app.redisClient.lpop(`${roomCode}:players`);

      players = await app.redisClient.lrange(`${roomCode}:players`, 0, -1);
      const currentDeck = await app.redisClient.lrange(
        `${roomCode}:cards`,
        0,
        -1
      );

      const currentPlayer = await app.redisClient.get(
        `${roomCode}:currentPlayer`
      );

      return res.status(201).send({
        players,
        currentDeck,
        currentPlayer,
      });
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  });
};
