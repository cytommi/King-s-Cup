import React, { useEffect, useContext } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { GlobalContext } from '../../context/Global';
import { GameContext } from '../../context/Game';
import CenterPan from './CenterPan';
import LeftPan from './LeftPan';
import RightPan from './RightPan';
import GameEventHandler from './GameEventHandler';
import GameEvents from '../../../../shared/GameEvents';

/** Components */
import TopNav from './TopNav';

import '../../styling/game/base.scss';

const Game = () => {
  const { socket, user } = useContext(GlobalContext);
  const [gameState, dispatch] = useContext(GameContext);

  const { roomcode } = useParams();
  if (user.room !== roomcode) return <Redirect to="/" />;

  useEffect(() => {
    socket.emit(GameEvents.client.JOIN_GAME, { ...user });
    return () =>
      socket.emit(GameEvents.client.QUIT_GAME, {
        forceNextRound:
          [9, 10, 11, 13].includes(gameState.currentCard.val) &&
          gameState.players[gameState.currentPlayer] ===
            `${user.name}_${user.gender}`,
      });
  }, []);
  return (
    <div id="game">
      <TopNav />
      <LeftPan />
      <CenterPan />
      <RightPan />
      <GameEventHandler />
    </div>
  );
};

export default Game;
