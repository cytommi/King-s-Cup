import React, { useContext } from 'react';
import { GameContext } from '../../../context/Game';
import { GlobalContext } from '../../../context/Global';
import PointingHand from '../../../assets/icons/pointingHand.png';
import GameEvents from '../../../../../shared/GameEvents';
import GamePhases from '../../../../../shared/GamePhases';
import '../../../styling/game/heaven.scss';

const Heaven = () => {
  const [gameState, dispatch] = useContext(GameContext);
  const { socket, user } = useContext(GlobalContext);

  const isEnabled = () =>
    gameState?.currentCard?.val === 7 &&
    gameState?.phase === GamePhases.PENDING_FORM_RESPONSES;

  const onClick = (ev) => {
    ev.preventDefault();
    if (!isEnabled()) return;
    socket.emit(GameEvents.client.FORM_SUBMISSION, {
      type: 7,
      payload: user.name,
    });
    document.getElementById('heaven').classList.remove('enabled');
  };
  return (
    <div id="heaven" className={isEnabled() ? 'enabled' : ''} onClick={onClick}>
      <h1>HEAVEN</h1>
      <img src={PointingHand} alt="point to heaven" />
    </div>
  );
};

export default Heaven;
