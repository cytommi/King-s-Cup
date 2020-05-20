import React from 'react';
import CurrentCard from './CurrentCard';
import FaceDownCard from './FaceDownCard';
import Heaven from './Heaven';
import Floor from './Floor';
import '../../../styling/game/centerPan.scss';

const CenterPan = () => {
  return (
    <div id="center-pan">
      <Heaven />
      <div id="cards-container">
        <FaceDownCard />
        <CurrentCard />
      </div>
      <Floor />
    </div>
  );
};

export default CenterPan;
