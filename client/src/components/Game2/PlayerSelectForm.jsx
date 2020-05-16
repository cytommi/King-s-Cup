import React, { useState, useContext } from 'react';
import { GlobalContext } from '../../context/Global';
import { GameContext } from '../../context/Game2';
import EventTypes from '../../../../shared/EventTypes';
import { parseUserInfo } from './utilities';
import '../../styling/game/playerSelectForm.scss';

const PlayerSelectForm = () => {
  const { socket } = useContext(GlobalContext);
  const { game, addMate, setGame } = useContext(GameContext);
  const [player, setPlayer] = useState('');
  const isSubmitDisabled = () => player === '';
  const onClick = (cardVal) => (ev) => {
    ev.preventDefault();
    if (cardVal === 8) addMate(player);
    socket.emit(EventTypes.game[cardVal], { drinker: player });
    setGame({
      showForm: false,
    });
  };

  const playerOptions = game.players.map((p, i) => {
    const [playerName, playerGender] = parseUserInfo(p);
    return (
      <label key={i} className={playerGender}>
        <input
          id={p}
          type="radio"
          name="player"
          value={playerName}
          checked={playerName === player}
          onChange={() => setPlayer(playerName)}
        />
        {playerName}
      </label>
    );
  });
  return game.showForm === 2 || game.showForm === 8 ? (
    <form id="player-select-form">
      {game.showForm === 2 ? (
        <h1>Pick a victim to drink this round!</h1>
      ) : (
        <h1>Select a new mate!</h1>
      )}
      {playerOptions}
      <button onClick={onClick(game.showForm)} disabled={isSubmitDisabled()}>
        submit
      </button>
    </form>
  ) : (
    <React.Fragment />
  );
};

export default PlayerSelectForm;
