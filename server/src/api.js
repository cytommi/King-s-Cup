const GamePhases = require("../../shared/GamePhases");
module.exports = (app) => {
  /**
   * @ENDPOINT
   * @method HEAD
   * @description check if room name exists
   * @param {req.params.room}
   * @returns {204 (if exists) || 404}
   */
  app.head("/api/game/:room", async (req, res) => {
    const { room } = req.params;
    if (await app.game.roomExists(room)) return res.status(204).send();
    return res.status(404).send();
  });

  /**
   * @ENDPOINT
   * @method HEAD
   * @description Check if name conflicts with existing names in room
   * @param {req.params.room}
   * @param {req.params.name}
   * @returns {204 || 409 (if name conflicts)}
   */
  /** Check if name conflicts with names already in room */
  app.head("/api/game/:room/:name", async (req, res) => {
    const { room, name } = req.params;
    try {
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  });

  /**
   * @ENDPOINT
   * @method POST
   * @description Client creates game
   * @param {req.params.room}
   * @returns {201 || 400}
   */
  app.post("/api/game/:room", async (req, res) => {
    const { room } = req.params;
    try {
      if (await app.game.roomExists(room))
        return res.status(409).send({
          error: `Room code: ${room} already exists. Try another code!`,
        });
      /** Initialize card deck */
      await app.game.initCards(room);

      /** Initialize game phase to pendingCardClick */
      await app.game.setPhase(room, GamePhases.PENDING_CARD_CLICK);

      /** DELETE THIS */
      for (let i = 13; i >= 1; --i)
        await app.redisClient.lpush(`${room}:CARDS`, i);

      await app.game.setCurrentPlayer(room, 0);
      res.status(201).send();
    } catch (err) {
      res.status(400).send({ error: err });
    }
  });

  /**
   * @ENDPOINT
   * @method POST
   * @description client joins game
   * @param {req.params.room}
   * @param {req.body.name}
   * @param {req.body.gender}
   * @returns {201 || 400 || 401}
   */
  app.post("/api/game/:room/players", async (req, res) => {
    const { room } = req.params;
    const { name, gender } = req.body;
    if (!name || !gender)
      return res
        .status(401)
        .send({ error: "Body must contain non-empty name and gender fields." });

    const playerName = `${name}_${gender}`;

    try {
      /** Check if room exists */
      if (!(await app.game.roomExists(room)))
        return res
          .status(404)
          .send({ error: `${room} is not a valid room code.` });

      /** Check if name conflicts */
      const players = await app.game.getPlayers(room);
      if (players.some((p) => p === `${name}_M` || p === `${name}_F`))
        return res.status(409).send({
          error: `Someone with the name: ${name} already exists in the room. Try another name!`,
        });

      /** PASS */
      await app.game.addPlayer(room, playerName);

      return res.status(201).send();
    } catch (err) {
      return res.status(400).send({ error: "Error attempting to join room." });
    }
  });
};
