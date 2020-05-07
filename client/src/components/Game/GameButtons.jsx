import React, { useContext } from 'react';
import { GlobalContext } from '../../context/Global';
import { GameContext } from '../../context/Game';
import EventTypes from '../../../../shared/EventTypes';
const GameButtons = () => {
  const { socket, user } = useContext(GlobalContext);
  const { game } = useContext(GameContext);

  const showReactionButton = (cardVal) => game.topCard.val === cardVal;

  const onClickReactionButton = (cardVal) => (ev) => {
    ev.preventDefault();
    socket.emit(EventTypes.game[cardVal], { user });
  };

  return (
    <>
      <button
        id="heaven"
        disabled={!showReactionButton(7)}
        onClick={onClickReactionButton(7)}
      >
        Heaven
      </button>
      <button
        id="floor"
        disabled={!showReactionButton(4)}
        onClick={onClickReactionButton(4)}
      >
        Floor
      </button>
    </>
  );
};

export default GameButtons;
