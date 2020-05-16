import React from 'react';
import '../../styling/game/card.scss';

const Card = ({ src, alt, onClick, isEnabled }) => (
  <div className={`card  ${isEnabled}`}>
    <img src={src} alt={alt} onClick={onClick} />
  </div>
);

export default Card;
