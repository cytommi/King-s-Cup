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

  const delPlayer = async (room, player) =>
    await rc.lrem(`${room}:PLAYERS`, 0, player);

  const getPlayers = async (room) => await rc.lrange(`${room}:PLAYERS`, 0, -1);

  const getPlayersCount = async (room) => await rc.llen(`${room}:PLAYERS`);

  /** CURRENT_PLAYER */
  const setCurrentPlayer = async (room, index) =>
    await rc.set(`${room}:CURRENT_PLAYER`, index);

  const getCurrentPlayer = async (room) =>
    await rc.get(`${room}:CURRENT_PLAYER`);

  const incrCurrentPlayer = async (room) => {
    const curInd = await getCurrentPlayer(room);
    const playersCount = await getPlayersCount(room);
    await setCurrentPlayer((curInd + 1) % playersCount);
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
    await setCurrentCard(card);
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
    getPhase,
    setPhase,

    /** STATE */
    getState,
  };
};
