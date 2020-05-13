import React, { useEffect, useContext, useRef } from 'react';
import { GameContext } from '../../context/Game';
import '../../styling/game/timer.scss';

const Timer = () => {
  // initialize timeLeft with the seconds prop
  const {
    game,
    decCountdown,
    updateGameFromCache,
    setShowDrinkers,
  } = useContext(GameContext);
  const { countdown } = game;
  const timerRef = useRef();

  useEffect(() => {
    // exit early when we reach 0
    if (countdown === 0) {
      timerRef.current.style.zIndex = -1;
      updateGameFromCache();
      setShowDrinkers(true);
      return;
    }
    if (countdown > 0) {
      timerRef.current.style.zIndex = 1000;
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

  return (
    <div ref={timerRef} id="timer">
      {countdown > 0 && (
        <h1 className={`countdown __${countdown}`}>{countdown}</h1>
      )}
    </div>
  );
};

export default Timer;
