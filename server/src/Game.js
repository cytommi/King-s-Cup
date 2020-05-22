const { CardDeck, parseCard } = require("../../shared/Utilities");
/**
 * @description This modules exports all functions required to store game state in redis
 */

module.exports = (app) => {
  const rc = app.redisClient;

  const roomExists = async (room) => (await getCurrentPlayer(room)) !== null;

  /** PLAYERS  */
  const addPlayer = async (room, player) =>
    await rc.rpush(`${room}:PLAYERS`, player);

  const delPlayer = async (room, disconnectedPlayer) => {
    try {
      const originalPlayers = await getPlayers(room);
      const originalPlayerIndex = await getCurrentPlayer(room);
      const originalPlayerName = originalPlayers[originalPlayerIndex];

      if (originalPlayerName === disconnectedPlayer)
        await incrCurrentPlayer(room);

      const newPlayerName = originalPlayers[await getCurrentPlayer(room)];
      /** Remove player from redis players list */
      await rc.lrem(`${room}:PLAYERS`, 0, disconnectedPlayer);

      /** Decrement expected responses for whatever form/announcement */
      await setExpectedResponses(room);

      const newPlayers = await getPlayers(room);
      if (newPlayers.length > 0)
        await setCurrentPlayer(room, newPlayers.indexOf(newPlayerName));
      else {
        await rc.del(
          `${room}:CARDS`,
          `${room}:PLAYERS`,
          `${room}:CURRENT_PLAYER`,
          `${room}:CURRENT_CARD`,
          `${room}:RESPONSES`,
          `${room}:EXPECTED_RES`,
          `${room}:PHASE`
        );
        console.log(`Closed room: ${room}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getPlayers = async (room) => await rc.lrange(`${room}:PLAYERS`, 0, -1);

  const getPlayersCount = async (room) => await rc.llen(`${room}:PLAYERS`);

  const getMalePlayers = async (room) => {
    const players = await getPlayers(room);
    return players.filter((p) => p.split("_")[1] === "M");
  };
  const getFemalePlayers = async (room) => {
    const players = await getPlayers(room);
    return players.filter((p) => p.split("_")[1] === "F");
  };

  /** PENDING_JOINS */
  const incrPendingJoins = async (room) =>
    await rc.incr(`${room}:PENDING_JOINS`);

  const getPendingJoins = async (room) => await rc.get(`${room}:PENDING_JOINS`);

  const clearPendingJoins = async (room) =>
    await rc.set(`${room}:PENDING_JOINS`, 0);

  /** CURRENT_PLAYER */
  const setCurrentPlayer = async (room, index) =>
    await rc.set(`${room}:CURRENT_PLAYER`, index);

  const getCurrentPlayer = async (room) =>
    await rc.get(`${room}:CURRENT_PLAYER`);

  const incrCurrentPlayer = async (room) => {
    const curInd = Number(await getCurrentPlayer(room));
    const playersCount = await getPlayersCount(room);
    await setCurrentPlayer(room, (curInd + 1) % playersCount);
  };

  /** CARDS */
  const initCards = async (room) =>
    await rc.lpush(`${room}:CARDS`, ...CardDeck());

  const popCards = async (room) => {
    let card = await rc.lpop(`${room}:CARDS`);
    if (!card) {
      await initCards(room);
      card = await rc.lpop(`${room}:CARDS`);
    }
    await setCurrentCard(room, card);
    return parseCard(card);
  };

  /** CURRENT_CARD */
  const setCurrentCard = async (room, val) =>
    await rc.set(`${room}:CURRENT_CARD`, val);

  const getCurrentCard = async (room) =>
    parseCard(await rc.get(`${room}:CURRENT_CARD`));

  /** PHASE */
  const setPhase = async (room, phase) => await rc.set(`${room}:PHASE`, phase);
  const getPhase = async (room) => await rc.get(`${room}:PHASE`);

  /** EXPECTED_RESPONSES */
  const setExpectedResponses = async (room) =>
    await rc.set(
      `${room}:EXPECTED_RES`,
      Number(await getPlayersCount(room)) - Number(await getPendingJoins(room))
    );
  const getExpectedResponses = async (room) =>
    await rc.get(`${room}:EXPECTED_RES`);

  /** RESPONSES */
  const incrResponses = async (room) => await rc.incr(`${room}:RESPONSES`);
  const isEnoughResponses = async (room) =>
    Number(await rc.get(`${room}:RESPONSES`)) >=
    Number(await getExpectedResponses(room));
  const resetResponses = async (room) => await rc.set(`${room}:RESPONSES`, 0);

  /** STATE */
  const getState = async (room) => {
    return {
      players: await getPlayers(room),
      currentPlayer: await getCurrentPlayer(room),
      currentCard: await getCurrentCard(room),
      phase: await getPhase(room),
    };
  };
  app.game = {
    roomExists,
    /** PLAYERS */
    addPlayer,
    delPlayer,
    getPlayers,
    getPlayersCount,
    getMalePlayers,
    getFemalePlayers,

    /** PENDING_JOINS */
    incrPendingJoins,
    getPendingJoins,
    clearPendingJoins,

    /** CURRENT_PLAYER */
    setCurrentPlayer,
    getCurrentPlayer,
    incrCurrentPlayer,

    /** CARDS */
    initCards,
    popCards,

    /** CURRENT_CARD */
    setCurrentCard,
    getCurrentCard,

    /** PHASE */
    setPhase,
    getPhase,

    /** EXPECTED_RESPONSES */
    setExpectedResponses,
    getExpectedResponses,

    /** RESPONSES */
    incrResponses,
    isEnoughResponses,
    resetResponses,

    /** STATE */
    getState,
  };
};
