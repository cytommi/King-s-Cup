import React, { useContext, useState } from 'react';
import { GameContext } from '../../../context/Game';
import { GlobalContext } from '../../../context/Global';
import { parseUserInfo } from '../../../../../shared/Utilities';
import GameEvents from '../../../../../shared/GameEvents';
import '../../../styling/game/playerSelectForm.scss';

const PlayerSelectForm = () => {
  const [gameState, dispatch] = useContext(GameContext);
  const { socket } = useContext(GlobalContext);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const onClick = (ev) => {
    ev.preventDefault();
    socket.emit(GameEvents.client.FORM_SUBMISSION, {
      type: gameState.currentCard.val,
      payload: selectedPlayer,
    });
    if (gameState.currentCard.val === 8) {
      dispatch({
        type: 'ADD_MATE',
        payload: selectedPlayer,
      });
    }
  };

  const playerOptions = gameState.players.map((p, i) => {
    const [playerName, playerGender] = parseUserInfo(p);
    return (
      <label key={i} className={playerGender}>
        <input
          id={p}
          type="radio"
          name="player"
          value={p}
          checked={p === selectedPlayer}
          onChange={() => setSelectedPlayer(p)}
        />
        {playerName}
      </label>
    );
  });

  return (
    <form id="player-select-form">
      {gameState.currentCard.val === 2 && <h1>PICK A VICTIM!</h1>}
      {gameState.currentCard.val === 8 && <h1>PICK A MATE!</h1>}
      {playerOptions}
      <button onClick={onClick}>submit</button>
    </form>
  );
};

export default PlayerSelectForm;
