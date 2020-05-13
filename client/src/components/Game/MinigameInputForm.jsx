import React, { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../context/Global';
import { GameContext } from '../../context/Game';
import EventTypes from '../../../../shared/EventTypes';
import '../../styling/game/minigameInputForm.scss';

const MinigameInputForm = () => {
  const { socket } = useContext(GlobalContext);
  const { game, setGame } = useContext(GameContext);
  const [input, setInput] = useState('');
  const onClick = (ev) => {
    ev.preventDefault();
    socket.emit(EventTypes.game[game.topCard.val], input);
    setGame({ showForm: false });
  };
  let eventTitle = undefined;

  switch (game.topCard.val) {
    case 9:
      eventTitle = 'Enter a word to rhyme with!';
      break;
    case 10:
      eventTitle = 'Enter a category!';
      break;
    case 11:
      eventTitle = 'Never have I ever...';
      break;
    case 13:
      eventTitle = 'Invent a new rule!';
      break;
    default:
      eventTitle = undefined;
  }

  return [9, 10, 11, 13].includes(game.showForm) ? (
    <form id="minigame-input-form">
      <h1>{eventTitle}</h1>
      <input type="text" onChange={(ev) => setInput(ev.target.value)} />
      <button onClick={onClick}>submit</button>
    </form>
  ) : (
    <React.Fragment />
  );
};

export default MinigameInputForm;
