import React, { useContext } from 'react';
import { GameContext } from '../../../context/Game';
// import CurrentPlayerArrow from '../../assets/icons/current_player_arrow.svg';
import { parseUserInfo } from '../../../../../shared/Utilities';

import '../../../styling/game/players.scss';

const Players = () => {
  const [gameState, dispatch] = useContext(GameContext);
  return (
    <div id="players">
      <h2>Players</h2>
      <div id="players-list">
        <ul>
          {gameState.players.length > 0 &&
            gameState.players.map((player, i) => {
              const [name, gender] = parseUserInfo(player);
              return (
                <li className={gender} key={i}>
                  {name}
                  {/* {game.players[game.currentPlayer] === player &&
                    CurrentPlayerArrow} */}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Players;
