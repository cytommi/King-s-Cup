import React, { useContext, useEffect } from 'react';
import { GameContext } from '../../context/Game2';
import { GlobalContext } from '../../context/Global';
import images from '../../assets/images';
import FaceDownCard from '../../assets/images/face_down.jpg';
import FaceDownCard_BW from '../../assets/images/face_down_black_and_white.jpg';
import EventTypes from '../../../../shared/EventTypes';
import Card from './Card';
import '../../styling/game/cards.scss';

const Cards = () => {
  const { game, setGame } = useContext(GameContext);
  const { socket, user } = useContext(GlobalContext);
  const { topCard } = game;
  const isMyTurn = () =>
    game.players[game.currentPlayer] === `${user.name}${user.gender}`;
  const onClickFlipCard = (ev) => {
    ev.preventDefault();
    if (!(isMyTurn() && game.everyoneReady)) return;
    socket.emit(EventTypes.client.FLIP_CARD, { room: user.room });
  };
  useEffect(() => {
    switch (game.topCard.val) {
      case 2:
      case 8:
      case 9:
      case 10:
      case 11:
      case 13:
        if (isMyTurn())
          setTimeout(() => {
            setGame({
              showForm: game.topCard.val,
            });
          }, 750);

        break;

      case 3:
        if (isMyTurn())
          setTimeout(() => socket.emit(EventTypes.game[3], { user }), 750);
        break;
    }
  }, [game.topCard, game.currentPlayer]);

  return (
    <div id="cards-container">
      <Card
        isEnabled={isMyTurn() && game.everyoneReady ? `enabled` : ``}
        src={isMyTurn() && game.everyoneReady ? FaceDownCard : FaceDownCard_BW}
        alt="Face Down Card"
        onClick={onClickFlipCard}
      />

      {topCard.val !== 0 ? (
        <Card
          eventName={topCard.eventName}
          src={images[topCard.imageName]}
          alt={`${topCard.val} of ${topCard.suit}`}
        />
      ) : (
        <div />
      )}
    </div>
  );
};

export default Cards;
