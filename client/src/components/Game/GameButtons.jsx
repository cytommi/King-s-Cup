import React, { useContext, useRef } from 'react';
import { GlobalContext } from '../../context/Global';
import { GameContext } from '../../context/Game';
import EventTypes from '../../../../shared/EventTypes';
import '../../styling/game/reactionButton.scss';

export const Heaven = () => {
  const { socket, user } = useContext(GlobalContext);
  const { game } = useContext(GameContext);
  const buttonRef = useRef();
  const showButton = () => game.topCard.val === 7;
  const onClick = (ev) => {
    ev.preventDefault();
    socket.emit(EventTypes.game[7], { user });
    buttonRef.current.disabled = true;
  };
  return (
    <button
      ref={buttonRef}
      id="heaven-button"
      className="reaction-button"
      disabled={!showButton()}
      onClick={onClick}
    >
      HEAVEN
    </button>
  );
};

export const Floor = () => {
  const { socket, user } = useContext(GlobalContext);
  const { game } = useContext(GameContext);
  const buttonRef = useRef();
  const showButton = () => game.topCard.val === 4;
  const onClick = (ev) => {
    ev.preventDefault();
    socket.emit(EventTypes.game[4], { user });
    buttonRef.current.disabled = true;
  };
  return (
    <button
      ref={buttonRef}
      id="floor-button"
      className="reaction-button"
      disabled={!showButton()}
      onClick={onClick}
    >
      FLOOR
    </button>
  );
};
