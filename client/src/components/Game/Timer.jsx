import React, { useEffect, useContext } from 'react';
import { GameContext } from '../../context/Game';

const Timer = () => {
  // initialize timeLeft with the seconds prop
  const { game, decCountdown, updateGameFromCache } = useContext(GameContext);
  const { countdown } = game;

  useEffect(() => {
    // exit early when we reach 0
    if (countdown === 0) {
      updateGameFromCache();
      return;
    }

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      decCountdown();
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => {
      clearInterval(intervalId);
    };
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [countdown]);

  return <>{countdown > 0 && <h1>{countdown}</h1>}</>;
};

export default Timer;
