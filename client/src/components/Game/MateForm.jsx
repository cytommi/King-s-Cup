import React, { useState, useContext } from 'react';
import { GameContext } from '../../context/Game';

const MateForm = () => {
  const { game, addMate } = useContext(GameContext);
  const [mate, setMate] = useState('');

  const onClickSubmit = (ev) => {
    ev.preventDefault();
    addMate(mate);
  };

  const playerOptions = game.players.map((player) => (
    <>
      <input
        id={player}
        type="radio"
        name="mate"
        value={player}
        checked={mate === player}
        onChange={() => setMate(player)}
      />
      <label htmlFor={player}>{player}</label>
    </>
  ));
  return (
    <form>
      {playerOptions}
      <button onClick={onClickSubmit}>submit</button>
    </form>
  );
};

export default MateForm;
