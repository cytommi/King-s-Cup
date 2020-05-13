import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../../context/Global';
import { GameContext } from '../../context/Game';
import { parseUserInfo } from './utilities';
import EventTypes from '../../../../shared/EventTypes';
import '../../styling/game/drinkers.scss';

const Drinkers = () => {
  const { game, setGame } = useContext(GameContext);
  const { socket } = useContext(GlobalContext);
  const { drinkers } = game;

  const onClickClosePopup = (ev) => {
    ev.preventDefault();
    setGame({
      drinkers: [],
      showDrinkers: false,
    });
    document.getElementById('game').classList.remove('blur');
    socket.emit(EventTypes.client.READY_FOR_NEXT_ROUND);
  };

  useEffect(() => {
    if (drinkers.length > 0 && game.showDrinkers)
      document.getElementById('game').classList.add('blur');
  }, [drinkers]);

  if (drinkers.length > 0 && game.showDrinkers) {
    if (drinkers[0] === undefined)
      return (
        <div id="drinkers-popup">
          <h1>NO LOSERS THIS ROUND!</h1>
          <button id="close-popup" onClick={onClickClosePopup}>
            NEXT ROUND!
          </button>
        </div>
      );
    else
      return (
        <div id="drinkers-popup">
          <h1>LOSERS DRINK UP!</h1>
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
  } else return <></>;
};
export default Drinkers;
