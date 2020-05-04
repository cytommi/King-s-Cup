import React, { useContext } from 'react';
import { GameContext } from '../../context/Game';

const GamePlayers = () => {
  const { game } = useContext(GameContext);
  return (
    <div>
      <h2>Players</h2>
      <ul>
        {game.players.length > 0 &&
          game.players.map((player, i) => <li key={i}>{player}</li>)}
      </ul>
      <h2>Current Turn: {game.currentPlayer}</h2>
    </div>
  );
};

export default GamePlayers;
