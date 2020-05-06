import React, { useContext } from 'react';
import { GameContext } from '../../context/Game';

const Drinkers = () => {
  const { game } = useContext(GameContext);
  const { drinkers } = game;

  return (
    <>
      <h1>Who drinks?</h1>
      {drinkers.length > 0 &&
        drinkers.map((drinker) => <h2 key={drinker}>{drinker}</h2>)}
    </>
  );
};
export default Drinkers;
