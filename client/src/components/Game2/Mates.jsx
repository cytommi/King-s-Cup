import React, { useContext } from 'react';
import { GameContext } from '../../context/Game2';
import { parseUserInfo } from './utilities';

import '../../styling/game/mates.scss';

const Mates = () => {
  const { game } = useContext(GameContext);

  return game.mates.length > 0 ? (
    <div id="mates">
      <h2>Your Mates</h2>
      <div id="mate-list">
        <ul>
          {game.mates.map((mate, i) => {
            const [name, gender] = parseUserInfo(mate);
            return (
              <li className={gender} key={i}>
                {name}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  ) : (
    <React.Fragment />
  );
};

export default Mates;
