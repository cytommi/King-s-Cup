import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../../context/Global';
import { GameContext } from '../../../context/Game';
import GameEvents from '../../../../../shared/GameEvents';
import '../../../styling/game/minigameInput.scss';

const Minigameinput = () => {
  const { socket } = useContext(GlobalContext);
  const [gameState, dispatch] = useContext(GameContext);
  const [input, setInput] = useState('');
  const onClick = (ev) => {
    ev.preventDefault();
    socket.emit(GameEvents.client.FORM_SUBMISSION, {
      type: gameState.currentCard.val,
      payload: input,
    });
  };
  let header;
  switch (gameState.currentCard.val) {
    case 9:
      header = 'Enter a word for rhyming!';
      break;
    case 10:
      header = 'Enter a category!';
      break;
    case 11:
      header = 'Never have I ever...';
      break;
    case 13:
      header = 'Enter a new rule!';
      break;
  }
  return (
    <form id="minigame-input">
      <h1>{header}</h1>
      <input
        type="text"
        val={input}
        onChange={(ev) => setInput(ev.target.value)}
      />
      <button onClick={onClick}>submit</button>
    </form>
  );
};

export default Minigameinput;
