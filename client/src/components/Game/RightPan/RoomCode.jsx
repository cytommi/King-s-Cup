import React, { useContext } from 'react';
import { GlobalContext } from '../../../context/Global';
import '../../../styling/game/roomCode.scss';

const RoomCode = () => {
  const { user } = useContext(GlobalContext);
  return (
    <div id="room-code">
      <h2 id="header">Join Code</h2>
      <div id="container">
        <h2 id="content">{user.room}</h2>
      </div>
    </div>
  );
};

export default RoomCode;
