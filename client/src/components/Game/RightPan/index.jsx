import React from 'react';
import Players from './Players';
import Timer from './Timer';
import '../../../styling/game/rightPan.scss';
const RightPan = () => {
  return (
    <div id="right-pan">
      <Players />
      <Timer />
    </div>
  );
};
export default RightPan;
