import React, { useContext } from 'react';
import { GlobalContext } from '../../context/Global';
import { GameContext } from '../../context/Game';
import EventTypes from '../../../../shared/EventTypes';
const GameButtons = () => {
  const { socket, user } = useContext(GlobalContext);
  const { game } = useContext(GameContext);

  const isMyTurn = () =>
    game.players[game.currentPlayer] === `${user.name}${user.gender}`;

  const showReactionButton = (cardVal) => game.topCard.val === cardVal;

  const onClickReactionButton = (cardVal) => (ev) => {
    ev.preventDefault();
    console.log('I clicked, emitting my name');
    socket.emit(EventTypes.game[cardVal], { user });
  };

  const onClickFlipCard = () => {
    socket.emit(EventTypes.client.FLIP_CARD, { room: user.room });
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
      <button id="flip-card" onClick={onClickFlipCard} disabled={!isMyTurn()}>
        Flip Card
      </button>
    </>
  );
};

export default GameButtons;
