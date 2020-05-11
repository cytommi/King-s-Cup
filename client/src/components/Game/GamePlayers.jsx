import React, { useContext } from 'react';
import { GameContext } from '../../context/Game';
import '../../styling/game/players.scss';
import CurrentPlayerArrow from '../../assets/icons/current_player_arrow.svg';
import { parseUserInfo } from './utilities';

const GamePlayers = () => {
  const { game } = useContext(GameContext);
  return (
    <div id="players">
      <h2>Players</h2>
      <div id="players-list">
        <ul>
          {game.players.length > 0 &&
            game.players.map((player, i) => {
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

export default GamePlayers;
