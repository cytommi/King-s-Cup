const GameEvents = require("../../shared/GameEvents");
const GamePhases = require("../../shared/GamePhases");

module.exports = (app) => {
  app.io.on("connection", async (socket) => {
    await app.game.incrCurrentConnectionsCount();
    await app.game.incrTotalConnectionsCount();
    socket.on(GameEvents.client.JOIN_GAME, async ({ name, gender, room }) => {
      console.log(`${name} has joined ${room}`);
      socket.customInfo = {
        name,
        gender,
        room,
      };
      socket.join(room);

      try {
        socket.emit(
          GameEvents.server.BROADCAST.INIT_DATA_SYNC,
          await app.game.getState(room)
        );
        if ((await app.game.getPhase(room)) !== GamePhases.PENDING_CARD_CLICK) {
          await app.game.incrPendingJoins(room);
        } else {
          socket.broadcast.emit(
            GameEvents.server.BROADCAST.NEW_MEMBER,
            await app.game.getPlayers(room)
          );
        }
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("disconnect", async () => {
      await app.game.decrCurrentConnectionsCount();
      if (!socket.customInfo) return;
      const { name, gender, room } = socket.customInfo;
      const playerName = `${name}_${gender}`;

      await app.game.delPlayer(room, playerName);
      // /** Update Players list in client view */
      socket.broadcast.emit(GameEvents.server.BROADCAST.DATA_SYNC, {
        currentPlayer: await app.game.getCurrentPlayer(room),
        players: await app.game.getPlayers(room),
        questionMaster: await app.game.getQuestionMaster(room),
      });

      await app.game.setExpectedResponses(room);
      if (app.game.isEnoughResponses(room)) {
        app.io.in(room).emit(GameEvents.server.BEGIN_ROUND, {
          currentPlayer: await app.game.getCurrentPlayer(room),
        });
        if (Number(await app.game.getPendingJoins(room)) > 0) {
          await app.game.clearPendingJoins(room);
          app.io
            .in(room)
            .emit(
              GameEvents.server.BROADCAST.NEW_MEMBER,
              await app.game.getPlayers(room)
            );
        }
        await app.game.setPhase(room, GamePhases.PENDING_CARD_CLICK);
      } else {
        await app.game.resetResponses(room);
        await app.io.in(room).emit(GameEvents.server.SHOW_ANNOUNCEMENT, {
          header: `${name} just left the game.`,
          bodyType: "string",
          body: "Let's start with a fresh round!",
        });
      }
    });

    socket.on(GameEvents.client.QUIT_GAME, async () => {
      await app.game.decrCurrentConnectionsCount();
      if (!socket.customInfo) return;
      const { name, gender, room } = socket.customInfo;
      const playerName = `${name}_${gender}`;

      await app.game.delPlayer(room, playerName);
      // /** Update Players list in client view */
      socket.broadcast.emit(GameEvents.server.BROADCAST.DATA_SYNC, {
        currentPlayer: await app.game.getCurrentPlayer(room),
        players: await app.game.getPlayers(room),
      });

      await app.game.setExpectedResponses(room);
      if (app.game.isEnoughResponses(room)) {
        app.io.in(room).emit(GameEvents.server.BEGIN_ROUND, {
          currentPlayer: await app.game.getCurrentPlayer(room),
        });
        if (Number(await app.game.getPendingJoins(room)) > 0) {
          await app.game.clearPendingJoins(room);
          app.io
            .in(room)
            .emit(
              GameEvents.server.BROADCAST.NEW_MEMBER,
              await app.game.getPlayers(room)
            );
        }
        await app.game.setPhase(room, GamePhases.PENDING_CARD_CLICK);
      } else {
        await app.game.resetResponses(room);
        await app.io.in(room).emit(GameEvents.server.SHOW_ANNOUNCEMENT, {
          header: `${name} just left the game.`,
          bodyType: "string",
          body: "Let's start with a fresh round!",
        });
      }
    });

    socket.on(GameEvents.client.CLICKED_CARD, async () => {
      const { room, name, gender } = socket.customInfo;
      /** 1. Set Phase to COUNTDOWN */
      await app.game.setPhase(room, GamePhases.COUNTDOWN);

      /** 2. Begin countdown on client side */
      app.io.in(room).emit(GameEvents.server.BEGIN_COUNTDOWN);

      /** 3. After 3 seconds, reveal card to client side */
      setTimeout(async () => {
        const currentCard = await app.game.popCards(room);
        app.io.in(room).emit(GameEvents.server.FLIP_CARD, {
          currentCard,
        });

        /** 4. Set phase to CARD_REACTION_TIME and reset number of responses*/
        await app.game.setPhase(room, GamePhases.CARD_REACTION_TIME);
        await app.game.resetResponses(room);

        /** 5. Take action based on card */
        switch (currentCard.val) {
          case 1:
            setTimeout(async () => {
              await app.game.setExpectedResponses(room);
              app.io.in(room).emit(GameEvents.server.SHOW_ANNOUNCEMENT, {
                header: "Waterfall!",
                bodyType: "text",
                body:
                  "You must keep chugging until the person left to you has stopped.",
              });
              await app.game.setPhase(room, GamePhases.PENDING_READY_RESPONSES);
            }, 1500);
            break;

          case 5:
          case 6:
            setTimeout(async () => {
              await app.game.setExpectedResponses(room);
              app.io.in(room).emit(GameEvents.server.SHOW_ANNOUNCEMENT, {
                header: currentCard.val === 5 ? "5 GUYS!" : "6 CHICKS",
                bodyType: "array",
                body:
                  currentCard.val === 5
                    ? await app.game.getMalePlayers(room)
                    : await app.game.getFemalePlayers(room),
              });
              await app.game.setPhase(room, GamePhases.PENDING_READY_RESPONSES);
            }, 1500);

          case 4:
          case 7:
            app.io.in(room).emit(GameEvents.server.SHOW_FORM);
            await app.game.setExpectedResponses(room);
            await app.game.setPhase(room, GamePhases.PENDING_FORM_RESPONSES);
            break;
          case 12:
            setTimeout(async () => {
              await app.game.setExpectedResponses(room);
              await app.game.setQuestionMaster(room, `${name}_${gender}`);
              app.io.in(room).emit(GameEvents.server.SHOW_ANNOUNCEMENT, {
                header: `${name} is the new Question Master!`,
                bodyType: "text",
                body: "Don't respond to his questions, got it?",
              });
              await app.game.setPhase(room, GamePhases.PENDING_READY_RESPONSES);
              app.io
                .in(room)
                .emit(GameEvents.server.BROADCAST.SET_QUESTION_MASTER, {
                  questionMaster: await app.game.getQuestionMaster(room),
                });
            }, 1500);

            break;
          default:
            setTimeout(async () => {
              app.io.in(room).emit(GameEvents.server.SHOW_FORM);
              await app.game.setPhase(room, GamePhases.PENDING_FORM_RESPONSES);
            }, 1500);
            break;
        }
      }, 3050);
    });

    socket.on(GameEvents.client.FORM_SUBMISSION, async ({ type, payload }) => {
      const { name, gender, room } = socket.customInfo;

      switch (type) {
        case 2:
          await app.game.setExpectedResponses(room);
          app.io.in(room).emit(GameEvents.server.SHOW_ANNOUNCEMENT, {
            header: `So cruel, ${name}`,
            bodyType: "string",
            body: `${name} has picked ${
              payload.split("_")[0]
            } to drink this game!`,
          });
          break;
        case 3:
          await app.game.setExpectedResponses(room);
          app.io.in(room).emit(GameEvents.server.SHOW_ANNOUNCEMENT, {
            header: `POOR ${name}...`,
            bodyType: "string",
            body: `${name} must drink by ${
              gender === "M" ? "him" : "her"
            }self this round!`,
          });
          break;

        case 4:
        case 7:
          await app.game.incrResponses(room);
          if (await app.game.isEnoughResponses(room)) {
            // await app.game.resetResponses(room);
            await app.game.setExpectedResponses(room);
            app.io.in(room).emit(GameEvents.server.SHOW_ANNOUNCEMENT, {
              header: type === 4 ? `4, FLOOR!` : "7, HEAVEN!",
              bodyType: "string",
              body: `${name} was the last to point to ${
                type === 4 ? "the floor" : "Heaven"
              }!`,
            });
          }
          break;
        case 8:
          await app.game.setExpectedResponses(room);
          app.io.in(room).emit(GameEvents.server.SHOW_ANNOUNCEMENT, {
            header: `8 MATE!`,
            bodyType: "string",
            body: `${name} has picked ${payload.split("_")[0]} as ${
              gender === "M" ? "his" : "her"
            } mate!`,
          });
          break;
        case 9:
          await app.game.setExpectedResponses(room);
          app.io.in(room).emit(GameEvents.server.SHOW_ANNOUNCEMENT, {
            header: `9 RHYME!`,
            bodyTYpe: "string",
            body: `${name} has picked the word: ${payload}`,
          });
          break;

        case 10:
          await app.game.setExpectedResponses(room);
          app.io.in(room).emit(GameEvents.server.SHOW_ANNOUNCEMENT, {
            header: "CATEGORIES!",
            bodyTYpe: "string",
            body: `${name} has picked the category: ${payload}`,
          });
          break;

        case 11:
          await app.game.setExpectedResponses(room);
          app.io.in(room).emit(GameEvents.server.SHOW_ANNOUNCEMENT, {
            header: `${name} has never...`,
            bodyTYpe: "string",
            body: payload,
          });
          break;

        case 13:
          await app.game.setExpectedResponses(room);
          app.io.in(room).emit(GameEvents.server.SHOW_ANNOUNCEMENT, {
            header: `KING'S CUP! ${name} MADE A NEW RULE!`,
            bodyTYpe: "string",
            body: payload,
          });
          break;
      }
    });

    socket.on(GameEvents.client.READY, async () => {
      const { room } = socket.customInfo;
      await app.game.incrResponses(room);
      if (await app.game.isEnoughResponses(room)) {
        // await app.game.resetResponses(room);
        await app.game.incrCurrentPlayer(room);
        setTimeout(async () => {
          app.io.in(room).emit(GameEvents.server.BEGIN_ROUND, {
            currentPlayer: await app.game.getCurrentPlayer(room),
          });
          if (Number(await app.game.getPendingJoins(room)) > 0) {
            await app.game.clearPendingJoins(room);
            app.io
              .in(room)
              .emit(
                GameEvents.server.BROADCAST.NEW_MEMBER,
                await app.game.getPlayers(room)
              );
          }

          await app.game.setPhase(room, GamePhases.PENDING_CARD_CLICK);
        }, 1000);
      }
    });
  });
};
