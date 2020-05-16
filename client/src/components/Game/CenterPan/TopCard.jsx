import React, { useContext } from 'react';
import { GameContext } from '../../../context/Game';
import images from '../../../assets/images';

const TopCard = () => {
  const [gameState, dispatch] = useContext(GameContext);

  return (
    <div id="top-card">
      {gameState.topCard && (
        <img
          src={images[gameState.topCard.imageName]}
          alt={gameState.topCard.imageName}
        />
      )}
    </div>
  );
};

export default TopCard;
