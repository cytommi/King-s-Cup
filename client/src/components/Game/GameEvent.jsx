import React, { useContext, useEffect } from 'react';
import { GameContext } from '../../context/Game';
import { GlobalContext } from '../../context/Global';
import MateForm from './MateForm';
import EventTypes from '../../../../shared/EventTypes';

const GameEvent = () => {
  const { game } = useContext(GameContext);
  const { user, socket } = useContext(GlobalContext);

  const isMyTurn = () =>
    game.players[game.currentPlayer] === `${user.name}${user.gender}`;

  const isTopCardVal = (val) => game.topCard.val === val;

  useEffect(() => {
    switch (game.topCard.val) {
      case 3:
        if (isMyTurn()) socket.emit(EventTypes.game[3], { user });
        break;
    }
  }, [game.topCard]);

  return (
    <>
      {!isTopCardVal(0) && <h1>{game.topCard.eventName}</h1>}
      {isTopCardVal(8) && <MateForm />}
    </>
  );
};

export default GameEvent;
