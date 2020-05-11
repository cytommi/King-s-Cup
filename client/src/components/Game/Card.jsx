import React from 'react';
import '../../styling/game/card.scss';

const Card = ({ src, alt, onClick, eventName }) => (
  <div className={`card ${alt === 'Face Down Card' ? '' : 'top-card'}`}>
    {alt === 'Face Down Card' ? <h2 /> : <h2>{eventName}</h2>}
    <img src={src} alt={alt} onClick={onClick} />
  </div>
);

export default Card;
