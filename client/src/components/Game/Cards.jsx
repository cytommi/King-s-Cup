import React, { useContext } from 'react';
import { GameContext } from '../../context/Game';
import { GlobalContext } from '../../context/Global';
import images from '../../assets/images';
import FaceDownCard from '../../assets/images/face_down.jpg';
import FaceDownCard_BW from '../../assets/images/face_down_black_and_white.jpg';

import EventTypes from '../../../../shared/EventTypes';

const Cards = () => {
  const { game } = useContext(GameContext);
  const { socket, user } = useContext(GlobalContext);
  const { topCard } = game;
  const isMyTurn = () =>
    game.players[game.currentPlayer] === `${user.name}${user.gender}`;

  const onClickFlipCard = (ev) => {
    ev.preventDefault();
    if (!isMyTurn()) return;
    socket.emit(EventTypes.client.FLIP_CARD, { room: user.room });
  };

  return (
    <>
      <img
        src={isMyTurn ? FaceDownCard : FaceDownCard_BW}
        alt="Face Down Card"
        onClick={onClickFlipCard}
      />

      {topCard.val !== 0 && (
        <img
          src={images[topCard.imageName]}
          alt={`${topCard.val} of ${topCard.suit}`}
        />
      )}
    </>
  );
};

export default Cards;
