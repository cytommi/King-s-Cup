import React from 'react';
import QuestionMaster from './QuestionMaster';
import Mates from './Mates';
import '../../../styling/game/leftPan.scss';
const LeftPan = () => {
  return (
    <div id="left-pan">
      <QuestionMaster />
      <Mates />
    </div>
  );
};

export default LeftPan;
