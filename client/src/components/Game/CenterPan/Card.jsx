import React from 'react';
import '../../../styling/game/card.scss';
const Card = ({ className, alt, src, onClick }) => (
  <div className="card">
    <img src={src} alt={alt} className={className} onClick={onClick}></img>
  </div>
);

export default Card;
