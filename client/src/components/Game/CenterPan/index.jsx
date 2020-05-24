import React from 'react';
import TopNav from '../TopNav';
import CurrentCard from './CurrentCard';
import FaceDownCard from './FaceDownCard';
import Heaven from './Heaven';
import Floor from './Floor';
import '../../../styling/game/centerPan.scss';

const CenterPan = () => {
  return (
    <div id="center-pan">
      <TopNav />
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
