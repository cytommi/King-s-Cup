import React from 'react';
import RoomCode from './RoomCode';
import Players from './Players';
import Timer from './Timer';
import '../../../styling/game/rightPan.scss';
const RightPan = () => {
  return (
    <div id="right-pan">
      <RoomCode />
      <Players />
      <Timer />
    </div>
  );
};
export default RightPan;
