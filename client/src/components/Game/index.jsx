import React, { useEffect, useContext } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { GlobalContext } from '../../context/Global';
import { GameContext } from '../../context/Game';
import WaitingRoom from './WaitingRoom';
import CenterPan from './CenterPan';
import LeftPan from './LeftPan';
import RightPan from './RightPan';
import GameEventHandler from './GameEventHandler';
import GameEvents from '../../../../shared/GameEvents';
import GamePhases from '../../../../shared/GamePhases';

import '../../styling/game/base.scss';

const Game = () => {
  const { socket, user, resetUser } = useContext(GlobalContext);
  const [gameState, dispatch] = useContext(GameContext);

  const { roomcode } = useParams();
  if (user.room !== roomcode) return <Redirect to="/" />;

  useEffect(() => {
    /** BROADCAST EVENTS */
    socket.on(GameEvents.server.BROADCAST.DATA_SYNC, (latestState) => {
      dispatch({
        type: GameEvents.server.BROADCAST.DATA_SYNC,
        payload: latestState,
      });
    });

    socket.on(GameEvents.server.BROADCAST.NEW_MEMBER, (players) => {
      dispatch({
        type: GameEvents.server.BROADCAST.NEW_MEMBER,
        payload: players,
      });
    });

    socket.on(
      GameEvents.server.BROADCAST.SET_QUESTION_MASTER,
      ({ questionMaster }) => {
        dispatch({
          type: GameEvents.server.BROADCAST.SET_QUESTION_MASTER,
          payload: questionMaster,
        });
      }
    );

    /** GAME EVENTS */
    socket.on(GameEvents.server.BEGIN_COUNTDOWN, () =>
      dispatch({
        type: GameEvents.server.BEGIN_COUNTDOWN,
      })
    );

    socket.on(GameEvents.server.FLIP_CARD, ({ currentCard }) => {
      dispatch({
        type: GameEvents.server.FLIP_CARD,
        payload: currentCard,
      });
    });

    socket.on(GameEvents.server.SHOW_FORM, () => {
      dispatch({
        type: GameEvents.server.SHOW_FORM,
      });
    });

    socket.on(GameEvents.server.SHOW_ANNOUNCEMENT, (announcement) => {
      dispatch({
        type: GameEvents.server.SHOW_ANNOUNCEMENT,
        payload: announcement,
      });
    });

    socket.on(GameEvents.server.BEGIN_ROUND, ({ currentPlayer }) => {
      dispatch({
        type: GameEvents.server.BEGIN_ROUND,
        payload: currentPlayer,
      });
    });
  }, []);

  useEffect(() => {
    /** REQUEST */
    socket.emit(GameEvents.client.JOIN_GAME, { ...user });

    /** RESPOSNE */
    socket.on(GameEvents.server.BROADCAST.INIT_DATA_SYNC, (latestState) => {
      let pendingJoin = latestState.phase !== GamePhases.PENDING_CARD_CLICK;
      dispatch({
        type: GameEvents.server.BROADCAST.DATA_SYNC,
        payload: { ...latestState, pendingJoin },
      });
    });

    return () => {
      socket.emit(GameEvents.client.QUIT_GAME, {
        forceNextRound:
          [9, 10, 11, 13].includes(gameState.currentCard.val) &&
          gameState.players[gameState.currentPlayer] ===
            `${user.name}_${user.gender}`,
      });
      resetUser();
    };
  }, []);

  return (
    <div id="game">
      <GameEventHandler />
      {gameState.pendingJoin ? (
        <WaitingRoom />
      ) : (
        <>
          <LeftPan />
          <CenterPan />
          <RightPan />
        </>
      )}
    </div>
  );
};

export default Game;
