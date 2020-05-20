import React, { useContext } from 'react';
import { GameContext } from '../../../context/Game';
import { GlobalContext } from '../../../context/Global';
import Card from './Card';
import BackOfCard from '../../../assets/images/face_down.jpg';
import BackOfCard_BW from '../../../assets/images/face_down_black_and_white.jpg';
import GameEvents from '../../../../../shared/GameEvents';
import GamePhases from '../../../../../shared/GamePhases';

const FaceDownCard = () => {
  const { user, socket } = useContext(GlobalContext);
  const [gameState, dispatch] = useContext(GameContext);
  const onClick = (ev) => {
    ev.preventDefault();
    if (isMyTurn()) socket.emit(GameEvents.client.CLICKED_CARD);
  };
  const isMyTurn = () =>
    gameState.players[gameState.currentPlayer] ===
      `${user.name}_${user.gender}` &&
    gameState.phase === GamePhases.PENDING_CARD_CLICK;

  return (
    <Card
      className={`${isMyTurn() ? 'enabled' : ''}`}
      src={isMyTurn() ? BackOfCard : BackOfCard_BW}
      alt={`Face Down Card`}
      onClick={onClick}
    />
  );
};

export default FaceDownCard;
