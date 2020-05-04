const EventTypes = require("../../shared/EventTypes");
const { getCard } = require("../../shared/Utilities");
const { CardDeck } = require("./utilities");

module.exports = (app) => {
  app.io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on(EventTypes.client.JOIN_GAME, async ({ name, room, gender }) => {
      socket.join(room);
      socket.customInfo = {
        room,
        name,
        gender,
      };

      try {
        const players = await app.redisClient.lrange(`${room}:players`, 0, -1);
        socket.broadcast.emit(EventTypes.server.BROADCAST.NEW_MEMBER, {
          players,
        });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on(EventTypes.client.FLIP_CARD, async ({ room }) => {
      try {
        let nextTopCard = await app.redisClient.lpop(`${room}:cards`);
        if (!nextTopCard) {
          await app.redisClient.rpush(`${room}:cards`, ...CardDeck());
          nextTopCard = await app.redisClient.lpop(`${room}:cards`);
        }
        const curPlayerIndex = Number(
          await app.redisClient.get(`${room}:currentPlayer`)
        );
        const numPlayers = await app.redisClient.llen(`${room}:players`);
        const nextPlayerIndex = (curPlayerIndex + 1) % numPlayers;

        await app.redisClient.set(`${room}:currentPlayer`, nextPlayerIndex);

        app.io.in(room).emit(EventTypes.server.CARD_FLIPPED, {
          card: getCard(nextTopCard),
          nextPlayerIndex,
        });

        /** Game Event handling */
        // const card = getCard(nextTopCard);
        // switch (card.val) {
        //   case 1:
        //     app.io.in(room).emit(EventTypes.game[1]);
        //   case 2:
        //     app.io.in
        // }
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("disconnect", async () => {
      try {
        const disconnectedPlayerName = `${socket.customInfo.name}__${socket.customInfo.gender}`;
        const originalPlayers = await app.redisClient.lrange(
          `${socket.customInfo.room}:players`,
          0,
          -1
        );
        const currentPlayerIndex = await app.redisClient.get(
          `${socket.customInfo.room}:currentPlayer`
        );
        const currentPlayerName = originalPlayers[currentPlayerIndex];

        /** Remove player from redis players list */
        await app.redisClient.lrem(
          `${socket.customInfo.room}:players`,
          0,
          disconnectedPlayerName
        );

        /** Get rid of cards list too if no players are eft in the room */
        const playersLeft = await app.redisClient.lrange(
          `${socket.customInfo.room}:players`,
          0,
          -1
        );

        if (playersLeft.length !== 0) {
          /** Update current player */
          let nextPlayerIndex = currentPlayerIndex;
          if (currentPlayerName === disconnectedPlayerName) {
            nextPlayerIndex = (nextPlayerIndex + 1) % playersLeft.length;
          } else {
            nextPlayerIndex = playersLeft.indexOf(currentPlayerName);
          }
          await app.redisClient.set(
            `${socket.customInfo.room}:currentPlayer`,
            nextPlayerIndex
          );
          socket.broadcast.emit(EventTypes.server.BROADCAST.DELETE_MEMBER, {
            players: playersLeft,
            currentPlayer: nextPlayerIndex,
          });
        } else {
          await app.redisClient.del(`${socket.customInfo.room}:cards`);
          await app.redisClient.del(`${socket.customInfo.room}:currentPlayer`);
          console.log(`Closed room: ${socket.customInfo.room}`);
        }
      } catch (err) {
        console.log(err);
      }
    });
  });
};
