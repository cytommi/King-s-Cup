import React, { useContext } from 'react';
import { GameContext } from '../../../context/Game';
import { GlobalContext } from '../../../context/Global';
import PointingHand from '../../../assets/icons/pointingHand.png';
import GameEvents from '../../../../../shared/GameEvents';
import GamePhases from '../../../../../shared/GamePhases';

import '../../../styling/game/floor.scss';

const Floor = () => {
  const [gameState, dispatch] = useContext(GameContext);
  const { socket, user } = useContext(GlobalContext);
  const isEnabled = () =>
    gameState?.currentCard?.val === 4 &&
    gameState?.phase === GamePhases.PENDING_FORM_RESPONSES;

  const onClick = (ev) => {
    ev.preventDefault();
    if (!isEnabled()) return;
    socket.emit(GameEvents.client.FORM_SUBMISSION, {
      type: 4,
      payload: user.name,
    });
    document.getElementById('floor').classList.remove('enabled');
  };
  return (
    <div id="floor" className={isEnabled() ? 'enabled' : ''} onClick={onClick}>
      <h1>Floor</h1>
      <img src={PointingHand} alt="point at floor" />
    </div>
  );
};

export default Floor;
