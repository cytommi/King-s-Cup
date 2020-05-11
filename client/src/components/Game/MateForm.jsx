import React, { useState, useContext } from 'react';
import { GameContext } from '../../context/Game';
import '../../styling/game/mateForm.scss';

const MateForm = () => {
  const { game, addMate, setGame } = useContext(GameContext);
  const [mate, setMate] = useState('');
  const isSubmitDisabled = () => mate === '';

  const onClickSubmit = (ev) => {
    ev.preventDefault();
    addMate(mate);
    setGame({ showMateForm: false });
  };

  const playerOptions = game.players.map((player, i) => (
    <label key={i}>
      <input
        id={player}
        type="radio"
        name="mate"
        value={player}
        checked={mate === player}
        onChange={() => setMate(player)}
      />
      {player}
    </label>
  ));
  return game.showMateForm ? (
    <form id="mate-form">
      <h1>Add a new mate!</h1>
      {playerOptions}
      <button onClick={onClickSubmit} disabled={isSubmitDisabled()}>
        submit
      </button>
    </form>
  ) : (
    <React.Fragment />
  );
};

export default MateForm;
