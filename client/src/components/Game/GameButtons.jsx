import React, { useContext } from 'react';
import { GlobalContext } from '../../context/Global';
import { GameContext } from '../../context/Game';
import EventTypes from '../../../../shared/EventTypes';
const GameButtons = () => {
  const { socket, user } = useContext(GlobalContext);
  const { game } = useContext(GameContext);

  const isMyTurn = () =>
    game.players[game.currentPlayer] === `${user.name}__${user.gender}`;

  const isFloor = () => game.topCard.val === 4;

  const isHeaven = () => game.topCard.val === 7;

  const onClickFlipCard = () => {
    socket.emit(EventTypes.client.FLIP_CARD, { room: user.room });
  };
  return (
    <>
      <button id="heaven" disabled={!isHeaven()}>
        Heaven
      </button>
      <button id="floor" disabled={!isFloor()}>
        Floor
      </button>
      <button id="flip-card" onClick={onClickFlipCard} disabled={!isMyTurn()}>
        Flip Card
      </button>
    </>
  );
};

export default GameButtons;
