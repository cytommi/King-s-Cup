import React, { useContext } from 'react';
import { GameContext } from '../../context/Game';
import images from '../../assets/images';
import FaceDownCard from '../../assets/images/face_down.jpg';

const Cards = () => {
  const { game } = useContext(GameContext);
  const { topCard } = game;
  return (
    <>
      <img src={FaceDownCard} alt="Face Down Card" />
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
