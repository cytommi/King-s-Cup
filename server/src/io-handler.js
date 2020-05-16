const GameEvents = require("../../shared/GameEvents");
const GamePhases = require("../../shared/GamePhases");

module.exports = (app) => {
  app.io.getNumSocketsInRoom = async (roomName) => {
    return app.redisClient.llen(`${roomName}:players`);
  };

  app.io.on("connection", (socket) => {
    socket.on(GameEvents.client.JOIN_GAME, async ({ name, gender, room }) => {
      socket.customInfo = {
        name,
        gender,
        room,
      };

      socket.join(room);

      try {
        socket.emit(
          GameEvents.server.BROADCAST.DATA_SYNC,
          await app.game.getState(room)
        );
        socket.broadcast.emit(
          GameEvents.server.BROADCAST.NEW_MEMBER,
          await app.game.getPlayers(room)
        );
      } catch (err) {
        console.log(err);
      }
    });

    socket.on(GameEvents.client.CLICKED_CARD, async () => {
      await app.game.setPhase(GamePhases.COUNTDOWN);
      app.io.in(socket.customInfo.room).emit(GameEvents.server.BEGIN_COUNTDOWN);
    });
    // socket.on(EventTypes.client.JOIN_GAME, async ({ name, room, gender }) => {
    //   socket.join(room);
    //   socket.customInfo = {
    //     room,
    //     name,
    //     gender,
    //   };
    //   console.log(`${name}${gender} just joined ${room}`);

    //   try {
    //     const players = await app.redisClient.lrange(`${room}:players`, 0, -1);
    //     socket.broadcast.emit(EventTypes.server.BROADCAST.NEW_MEMBER, {
    //       players,
    //     });
    //   } catch (err) {
    //     console.log(err);
    //   }
    // });

    // socket.on(EventTypes.client.FLIP_CARD, async ({ room }) => {
    //   try {
    //     let nextTopCard = await app.redisClient.lpop(`${room}:cards`);
    //     if (!nextTopCard) {
    //       await app.redisClient.rpush(`${room}:cards`, ...CardDeck());
    //       nextTopCard = await app.redisClient.lpop(`${room}:cards`);
    //     }
    //     const curPlayerIndex = Number(
    //       await app.redisClient.get(`${room}:currentPlayer`)
    //     );
    //     const numPlayers = await app.redisClient.llen(`${room}:players`);
    //     const nextPlayerIndex = (curPlayerIndex + 1) % numPlayers;

    //     await app.redisClient.set(`${room}:currentPlayer`, nextPlayerIndex);

    //     app.io.in(room).emit(EventTypes.server.CARD_FLIPPED, {
    //       card: getCard(nextTopCard),
    //       nextPlayerIndex,
    //     });

    //     const card = getCard(nextTopCard);
    //     const players = await app.redisClient.lrange(`${room}:players`, 0, -1);
    //     switch (card.val) {
    //       case 1:
    //         setTimeout(async () => {
    //           await app.redisClient.set(
    //             `${socket.customInfo.room}:expectedResponses`,
    //             await app.io.getNumSocketsInRoom(`${socket.customInfo.room}`)
    //           );

    //           await app.io
    //             .in(room)
    //             .emit(EventTypes.server.BROADCAST.ANNOUNCEMENT, {
    //               header: `WATERFALL`,
    //               bodyType: "String",
    //               body: `You don't stop chugging until the person left to you has stopped!`,
    //             });
    //         }, 3750);

    //         break;

    //       case 5:
    //         const guys = players.filter((player) => player.slice(-1) === "M");
    //         setTimeout(async () => {
    //           await app.redisClient.set(
    //             `${socket.customInfo.room}:expectedResponses`,
    //             await app.io.getNumSocketsInRoom(socket.customInfo.room)
    //           );
    //           app.io.in(room).emit(EventTypes.server.BROADCAST.ANNOUNCEMENT, {
    //             header: `5 GUYS... DRINK UP BOIZ!`,
    //             bodyType: "Array",
    //             body: guys,
    //           });
    //         }, 3750);

    //         break;
    //       case 6:
    //         const chicks = players.filter((player) => player.slice(-1) === "F");
    //         setTimeout(async () => {
    //           await app.redisClient.set(
    //             `${socket.customInfo.room}:expectedResponses`,
    //             await app.io.getNumSocketsInRoom(socket.customInfo.room)
    //           );
    //           app.io.in(room).emit(EventTypes.server.BROADCAST.ANNOUNCEMENT, {
    //             header: `6 CHICKS... DRINK UP GURLZ!`,
    //             bodyType: "Array",
    //             body: chicks,
    //           });
    //         }, 3750);

    //         break;
    //     }
    //   } catch (err) {
    //     console.log(err);
    //   }
    // });

    // /** Game Event handling */
    // socket.on(EventTypes.game[2], async ({ drinker }) => {
    //   await app.redisClient.set(
    //     `${socket.customInfo.room}:expectedResponses`,
    //     await app.io.getNumSocketsInRoom(socket.customInfo.room)
    //   );
    //   app.io
    //     .in(socket.customInfo.room)
    //     .emit(EventTypes.server.BROADCAST.ANNOUNCEMENT, {
    //       header: `We have a victim!`,
    //       bodyType: "String",
    //       body: `${socket.customInfo.name} just picked ${drinker} to drink for this round.`,
    //     });
    // });

    // socket.on(EventTypes.game[3], async ({ user }) => {
    //   await app.redisClient.set(
    //     `${socket.customInfo.room}:expectedResponses`,
    //     await app.io.getNumSocketsInRoom(socket.customInfo.room)
    //   );
    //   app.io
    //     .in(socket.customInfo.room)
    //     .emit(EventTypes.server.BROADCAST.ANNOUNCEMENT, {
    //       header: `You did this to yourself.`,
    //       bodyType: `String`,
    //       body: `So unlucky, ${user.name}. Drink.`,
    //     });
    // });

    // socket.on(EventTypes.game[4], async ({ user }) => {
    //   const name = `${user.name}${user.gender}`;
    //   const numPlayers = await app.redisClient.llen(
    //     `${socket.customInfo.room}:players`
    //   );
    //   await app.redisClient.lpush(`${socket.customInfo.room}:responses`, name);
    //   const numResponses = await app.redisClient.llen(
    //     `${socket.customInfo.room}:responses`
    //   );

    //   if (numResponses === numPlayers) {
    //     setTimeout(async () => {
    //       await app.redisClient.set(
    //         `${socket.customInfo.room}:expectedResponses`,
    //         await app.io.getNumSocketsInRoom(socket.customInfo.room)
    //       );
    //       app.io
    //         .in(socket.customInfo.room)
    //         .emit(EventTypes.server.BROADCAST.ANNOUNCEMENT, {
    //           header: `Drink your part, ${socket.customInfo.name}`,
    //           bodyType: "String",
    //           body: `You're just too slow. `,
    //         });
    //       await app.redisClient.del(`${socket.customInfo.room}:responses`);
    //     }, 750);
    //   }
    // });

    // socket.on(EventTypes.game[7], async ({ user }) => {
    //   const name = `${user.name}${user.gender}`;
    //   const numPlayers = await app.redisClient.llen(
    //     `${socket.customInfo.room}:players`
    //   );
    //   await app.redisClient.lpush(`${socket.customInfo.room}:responses`, name);
    //   const numResponses = await app.redisClient.llen(
    //     `${socket.customInfo.room}:responses`
    //   );

    //   if (numResponses === numPlayers) {
    //     setTimeout(async () => {
    //       await app.redisClient.set(
    //         `${socket.customInfo.room}:expectedResponses`,
    //         await app.io.getNumSocketsInRoom(socket.customInfo.room)
    //       );
    //       app.io
    //         .in(socket.customInfo.room)
    //         .emit(EventTypes.server.BROADCAST.ANNOUNCEMENT, {
    //           header: `DRINK, ${socket.customInfo.name}`,
    //           bodyType: `String`,
    //           body: `You were the slowest to point to heaven. Shame.`,
    //         });
    //       await app.redisClient.del(`${socket.customInfo.room}:responses`);
    //     }, 750);
    //   }
    // });

    // socket.on(EventTypes.game[8], async ({ drinker }) => {
    //   await app.redisClient.set(
    //     `${socket.customInfo.room}:expectedResponses`,
    //     await app.io.getNumSocketsInRoom(socket.customInfo.room)
    //   );
    //   const name = socket.customInfo.name;
    //   app.io
    //     .in(socket.customInfo.room)
    //     .emit(EventTypes.server.BROADCAST.ANNOUNCEMENT, {
    //       header: `${name} has selected ${drinker} as a mate.`,
    //       bodyType: "String",
    //       body: `Starting now, ${drinker} must also drink whenever ${name} drinks`,
    //     });
    // });

    // socket.on(EventTypes.game[9], async (userInput) => {
    //   await app.redisClient.set(
    //     `${socket.customInfo.room}:expectedResponses`,
    //     await app.io.getNumSocketsInRoom(socket.customInfo.room)
    //   );
    //   app.io
    //     .in(socket.customInfo.room)
    //     .emit(EventTypes.server.BROADCAST.ANNOUNCEMENT, {
    //       header: `${socket.customInfo.name} has selected the following word to rhyme with:`,
    //       bodyType: "String",
    //       body: userInput,
    //     });
    // });
    // socket.on(EventTypes.game[10], async (userInput) => {
    //   await app.redisClient.set(
    //     `${socket.customInfo.room}:expectedResponses`,
    //     await app.io.getNumSocketsInRoom(socket.customInfo.room)
    //   );
    //   app.io
    //     .in(socket.customInfo.room)
    //     .emit(EventTypes.server.BROADCAST.ANNOUNCEMENT, {
    //       header: `${socket.customInfo.name} has selected the category`,
    //       bodyType: "String",
    //       body: userInput,
    //     });
    // });
    // socket.on(EventTypes.game[11], async (userInput) => {
    //   await app.redisClient.set(
    //     `${socket.customInfo.room}:expectedResponses`,
    //     await app.io.getNumSocketsInRoom(socket.customInfo.room)
    //   );
    //   app.io
    //     .in(socket.customInfo.room)
    //     .emit(EventTypes.server.BROADCAST.ANNOUNCEMENT, {
    //       header: `Never have I ever...`,
    //       bodyType: "String",
    //       body: `${socket.customInfo.name} says: ${userInput}`,
    //     });
    // });

    // socket.on(EventTypes.game[13], async (userInput) => {
    //   await app.redisClient.set(
    //     `${socket.customInfo.room}:expectedResponses`,
    //     await app.io.getNumSocketsInRoom(socket.customInfo.room)
    //   );
    //   app.io
    //     .in(socket.customInfo.room)
    //     .emit(EventTypes.server.BROADCAST.ANNOUNCEMENT, {
    //       header: `KING'S CUP! ${socket.customInfo.name} created a new rule!`,
    //       bodyType: "String",
    //       body: `${userInput}`,
    //     });
    // });

    // socket.on(EventTypes.client.READY_FOR_NEXT_ROUND, async () => {
    //   await app.redisClient.incr(`${socket.customInfo.room}:ready`);
    //   const numResponses = Number(
    //     await app.redisClient.get(`${socket.customInfo.room}:ready`)
    //   );
    //   const expectedResponses = Number(
    //     await app.redisClient.get(`${socket.customInfo.room}:expectedResponses`)
    //   );

    //   if (numResponses === expectedResponses) {
    //     app.io
    //       .in(socket.customInfo.room)
    //       .emit(EventTypes.server.BROADCAST.PROCEED_TO_NEXT_ROUND);
    //     await app.redisClient.del(
    //       `${socket.customInfo.room}:ready`,
    //       `${socket.customInfo.room}:expectedResponses)`
    //     );
    //   } else {
    //     console.log({ numResponses, expectedResponses });
    //   }
    // });

    // const onClientLeaveRoom = async () => {
    //   console.log("Client disconnected");
    //   try {
    //     const disconnectedPlayerName = `${socket.customInfo.name}${socket.customInfo.gender}`;
    //     const originalPlayers = await app.redisClient.lrange(
    //       `${socket.customInfo.room}:players`,
    //       0,
    //       -1
    //     );
    //     const currentPlayerIndex = await app.redisClient.get(
    //       `${socket.customInfo.room}:currentPlayer`
    //     );
    //     const currentPlayerName = originalPlayers[currentPlayerIndex];

    //     /** Remove player from redis players list */
    //     await app.redisClient.lrem(
    //       `${socket.customInfo.room}:players`,
    //       0,
    //       disconnectedPlayerName
    //     );

    //     /** Get rid of cards list too if no players are eft in the room */
    //     const playersLeft = await app.redisClient.lrange(
    //       `${socket.customInfo.room}:players`,
    //       0,
    //       -1
    //     );

    //     if (playersLeft.length !== 0) {
    //       /** Update current player */
    //       let nextPlayerIndex = currentPlayerIndex;
    //       if (currentPlayerName === disconnectedPlayerName) {
    //         nextPlayerIndex = (nextPlayerIndex + 1) % playersLeft.length;
    //       } else {
    //         nextPlayerIndex = playersLeft.indexOf(currentPlayerName);
    //       }
    //       await app.redisClient.set(
    //         `${socket.customInfo.room}:currentPlayer`,
    //         nextPlayerIndex
    //       );
    //       socket.broadcast.emit(EventTypes.server.BROADCAST.DELETE_MEMBER, {
    //         players: playersLeft,
    //         currentPlayer: nextPlayerIndex,
    //       });
    //     } else {
    //       await app.redisClient.del(
    //         `${socket.customInfo.room}:cards`,
    //         `${socket.customInfo.room}:currentPlayer`,
    //         `${socket.customInfo.room}:responses`
    //       );
    //       console.log(`Closed room: ${socket.customInfo.room}`);
    //     }
    //   } catch (err) {
    //     console.log("ERROR");
    //   }
    // };
    // socket.on(EventTypes.client.LEAVE_GAME, onClientLeaveRoom);
    // socket.on("disconnect", onClientLeaveRoom);
  });
};
