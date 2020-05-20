import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../../../context/Game';
import GamePhases from '../../../../../shared/GamePhases';
import '../../../styling/game/timer.scss';
const Timer = () => {
  const [gameState, dispatch] = useContext(GameContext);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (gameState.phase === GamePhases.COUNTDOWN) setSeconds(3);
  }, [gameState.phase]);

  useEffect(() => {
    setTimeout(() => {
      if (seconds > 0) setSeconds((sec) => sec - 1);
    }, 1000);
  }, [seconds]);
  return gameState.phase === GamePhases.COUNTDOWN && seconds > 0 ? (
    <h1 id="timer" className={`__${seconds}`}>
      {seconds}
    </h1>
  ) : (
    <></>
  );
};

export default Timer;
