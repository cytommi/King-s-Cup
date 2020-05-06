import React, { useContext, useEffect } from 'react';
import { GameContext } from '../../context/Game';
import { GlobalContext } from '../../context/Global';
import EventTypes from '../../../../shared/EventTypes';

const GameEvent = () => {
  const { game } = useContext(GameContext);
  const { user, socket } = useContext(GlobalContext);
  useEffect(() => {
    switch (game.topCard.val) {
      case 3:
        socket.emit(EventTypes.game[3], { user });
        break;
    }
  }, [game.topCard]);

  return game.topCard.val === 0 ? <></> : <h1>{game.topCard.eventName}</h1>;
};

export default GameEvent;
