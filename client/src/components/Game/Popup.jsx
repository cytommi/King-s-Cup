import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../../context/Global';
import { GameContext } from '../../context/Game';
import { parseUserInfo } from './utilities';
import '../../styling/game/popup.scss';

const Popup = () => {
  const { user } = useContext(GlobalContext);
  const { game, setGame } = useContext(GameContext);
  const { drinkers } = game;

  const onClickClosePopup = (ev) => {
    ev.preventDefault();
    setGame({
      drinkers: [],
    });
    document.getElementById('game').classList.remove('blur');
  };

  useEffect(() => {
    if (drinkers.length > 0)
      document.getElementById('game').classList.add('blur');
  }, [drinkers]);

  return drinkers.length <= 0 ? (
    <></>
  ) : (
    <div id="drinkers-popup">
      {drinkers.includes(`${user.name}${user.gender}`) ? (
        <h1 className="drink-up">YOU DRINK UP</h1>
      ) : (
        <h1 className="safe">YOU'RE SAFE </h1>
      )}
      {drinkers.map((drinker, i) => {
        const [name, gender] = parseUserInfo(drinker);
        return (
          <h2 key={i} className={gender}>
            {name}
          </h2>
        );
      })}
      <button id="close-popup" onClick={onClickClosePopup}>
        NEXT ROUND!
      </button>
    </div>
  );
};
export default Popup;
