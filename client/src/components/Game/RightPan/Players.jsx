import React, { useContext } from 'react';
import { GameContext } from '../../../context/Game';
import CurrentPlayerArrow from '../../../assets/icons/current_player_arrow.svg';
import { parseUserInfo } from '../../../../../shared/Utilities';

import '../../../styling/game/players.scss';

const Players = () => {
  const [gameState, dispatch] = useContext(GameContext);
  const isCurrentPlayer = (player) => {
    const curPlayer = gameState.players[gameState.currentPlayer];
    return player === curPlayer;
  };
  return (
    <div id="players">
      <h2>Players</h2>
      <div id="players-list">
        <ul>
          {gameState.players.length > 0 &&
            gameState.players.map((player, i) => {
              const isCur = isCurrentPlayer(player);
              const [name, gender] = parseUserInfo(player);
              return (
                <li className={`${gender} ${isCur ? 'pulse' : ''}`} key={i}>
                  {isCur && (
                    <img src={CurrentPlayerArrow} alt="current player"></img>
                  )}
                  <h3>{name}</h3>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Players;
