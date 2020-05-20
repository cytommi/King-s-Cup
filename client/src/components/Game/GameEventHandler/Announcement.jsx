import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../../context/Global';
import { GameContext } from '../../../context/Game';
import GameEvents from '../../../../../shared/GameEvents';
import '../../../styling/game/announcement.scss';

const Announcement = () => {
  const [waiting, setWaiting] = useState(false);
  const [gameState, dispatch] = useContext(GameContext);
  const { socket } = useContext(GlobalContext);
  const { header, body, bodyType } = gameState.announcement;

  const onClickClose = (ev) => {
    ev.preventDefault();
    socket.emit(GameEvents.client.READY);
    setWaiting(true);
  };

  let announcementBody;
  if (bodyType === 'array') {
    announcementBody = (
      <ul>
        {body.map((player) => {
          const [playerName, playerGender] = player.split('_');
          return (
            <h2 className={playerGender} key={playerName}>
              {playerName}
            </h2>
          );
        })}
      </ul>
    );
  } else {
    announcementBody = <h2>{body}</h2>;
  }

  return (
    <div id="announcement">
      {waiting ? (
        <h2>Waiting for other players to get ready...</h2>
      ) : (
        <>
          <h1>{header}</h1>
          {announcementBody}
          <button id="close-announcement" onClick={onClickClose}>
            NEXT ROUND!
          </button>
        </>
      )}
    </div>
  );
};
export default Announcement;
