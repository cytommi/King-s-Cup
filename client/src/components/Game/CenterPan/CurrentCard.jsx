import React, { useContext } from 'react';
import { GameContext } from '../../../context/Game';
import Card from './Card';
import images from '../../../assets/images';

const CurrentCard = () => {
  const [gameState, dispatch] = useContext(GameContext);

  return (
    gameState.currentCard && (
      <Card
        src={images[gameState.currentCard.imageName]}
        alt={gameState.currentCard.imageName}
      />
    )
  );
};

export default CurrentCard;
