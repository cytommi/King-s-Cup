import React, { useContext } from 'react';
import { GameContext } from '../../../context/Game';
import { parseUserInfo } from '../../../../../shared/Utilities';

import '../../../styling/game/mates.scss';

const Mates = () => {
  const [gameState, dispatch] = useContext(GameContext);
  return gameState?.mates?.length > 0 ? (
    <div id="mates">
      <h2>Mates</h2>
      <div id="mates-list">
        <ul>
          {gameState.mates.length > 0 &&
            gameState.mates.map((mate, i) => {
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
    <></>
  );
};

export default Mates;
