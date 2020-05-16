import React from 'react';
import TopCard from './TopCard';
import FaceDownCard from './FaceDownCard';

const CenterPan = () => {
  return (
    <div id="center-pan">
      <div id="cards-container">
        <FaceDownCard />
        <TopCard />
      </div>
    </div>
  );
};

export default CenterPan;
