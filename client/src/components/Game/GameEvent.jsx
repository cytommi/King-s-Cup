import React, { useContext } from 'react';
import { GameContext } from '../../context/Game';

const GameEvent = () => {
  const { game } = useContext(GameContext);
  return game.topCard.val === 0 ? <></> : <h1>{game.topCard.eventName}</h1>;
};

export default GameEvent;
