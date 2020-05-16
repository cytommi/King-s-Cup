import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../../context/Global';
import { GameContext } from '../../context/Game2';
import { parseUserInfo } from './utilities';
import EventTypes from '../../../../shared/EventTypes';
import '../../styling/game/announcement.scss';

const Announcement = () => {
  const { game, setGame } = useContext(GameContext);
  const { socket } = useContext(GlobalContext);

  const onClickClose = (ev) => {
    ev.preventDefault();
    socket.emit(EventTypes.client.READY_FOR_NEXT_ROUND);
    setGame({
      showAnnouncement: false,
      announcement: undefined,
    });
  };

  return game.announcement && game.showAnnouncement ? (
    <div id="announcement">
      <h1>{game.announcement.header}</h1>
      {game.announcement.bodyType === 'String' && (
        <h2>{game.announcement.body}</h2>
      )}
      {game.announcement.bodyType === 'Array' &&
        game.announcement.body.map((p, i) => {
          const [playerName, playerGender] = parseUserInfo(p);
          return (
            <h2 key={i} className={playerGender}>
              {playerName}
            </h2>
          );
        })}
      {game.announcement.bodyType === 'Array' &&
        game.announcement.body.length === 0 && (
          <h2>{`Oh wait, there are no ${
            game.topCard.val === 5 ? 'guys' : 'girls'
          } in this game. LMAO`}</h2>
        )}
      <button id="close-announcement" onClick={onClickClose}>
        NEXT ROUND!
      </button>
    </div>
  ) : (
    <></>
  );
};
export default Announcement;
