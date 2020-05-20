import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from '../../../context/Game';
import { GlobalContext } from '../../../context/Global';
import PlayerSelectForm from './PlayerSelectForm';
import GameEvents from '../../../../../shared/GameEvents';
import GamePhases from '../../../../../shared/GamePhases';
import MinigameInput from './MinigameInput';
import Announcement from './Announcement';

const GameEventHandler = () => {
  const { user, socket } = useContext(GlobalContext);
  const [gameState, dispatch] = useContext(GameContext);
  const [popup, setPopup] = useState('');

  const isMyTurn = () =>
    gameState.players[gameState.currentPlayer] ===
    `${user.name}_${user.gender}`;

  const showForm = () => gameState.phase === GamePhases.PENDING_FORM_RESPONSES;

  const showAnnouncement = () =>
    gameState.phase === GamePhases.PENDING_READY_RESPONSES;

  useEffect(() => {
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
    /** Decide which form to show */
    if (showForm()) {
      switch (gameState?.currentCard?.val) {
        case 2:
        case 8:
          if (isMyTurn()) {
            setPopup('PlayerSelectForm');
          }
          break;
        case 3:
          if (isMyTurn())
            socket.emit(GameEvents.client.FORM_SUBMISSION, {
              type: 3,
              payload: user,
            });
          break;

        case 9:
        case 10:
        case 11:
        case 13:
          if (isMyTurn()) {
            setPopup(`MinigameInput`);
          }
          break;
        default:
          break;
      }
    } else if (showAnnouncement()) {
      setPopup(`Announcement`);
    } else {
      setPopup('');
    }
  }, [gameState.phase]);

  return (
    <div id="game-event-handler">
      {popup === 'PlayerSelectForm' && <PlayerSelectForm />}
      {popup === 'MinigameInput' && <MinigameInput />}
      {popup === 'Announcement' && <Announcement />}
    </div>
  );
};

export default GameEventHandler;
