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

  return gameState.pendingJoin ? (
    <></>
  ) : (
    <div id="game-event-handler">
      {popup === 'PlayerSelectForm' && <PlayerSelectForm />}
      {popup === 'MinigameInput' && <MinigameInput />}
      {popup === 'Announcement' && <Announcement />}
    </div>
  );
};

export default GameEventHandler;
