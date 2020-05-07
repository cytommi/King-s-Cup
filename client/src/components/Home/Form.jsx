import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { GlobalContext } from '../../context/Global';
const Form = () => {
  const [joinCode, setJoinCode] = useState('');
  const [customCode, setCustomCode] = useState('');
  const { user, setUser } = useContext(GlobalContext);
  const [error, setError] = useState('');
  const history = useHistory();
  const joinButtonDisabled = () => {
    return !(user.name && joinCode);
  };
  const createButtonDisabled = () => {
    return !(user.name && customCode);
  };

  const onClickJoin = async (ev) => {
    ev.preventDefault();
    const res = await fetch(
      `${process.env.API_URL}/game/${joinCode}/${user.name}`,
      {
        method: 'HEAD',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
    if (res.ok) {
      setUser({
        ...user,
        room: joinCode,
      });
      history.push(`/game/${joinCode}`);
    } else if (res.status === 404) {
      setError(`Join Code: ${joinCode} does not exist`);
    } else if (res.status === 409) {
      setError(
        `Player name: ${user.name} already exists in game room. Try another name.`
      );
    }
  };
  const onClickCreate = async (ev) => {
    ev.preventDefault();
    const res = await fetch(`${process.env.API_URL}/game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ customCode }),
    });
    if (res.ok) {
      setUser({
        ...user,
        room: customCode,
      });
      history.push(`/game/${customCode}`);
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (
    <form>
      <h1>{error}</h1>
      <div id="grid-container">
        <div id="user-info">
          <h2 id="info-header">Enter Your Info</h2>
          <div id="name-input" className="player-info">
            <input
              name="name"
              type="text"
              value={user.name}
              placeholder="your player name"
              onChange={(ev) =>
                setUser({
                  ...user,
                  name: ev.target.value,
                })
              }
            />
          </div>
          <div id="gender-input" className="player-info">
            <label htmlFor="gender-iuput">I am a: </label>
            <label>
              <input
                type="radio"
                value="M"
                checked={user.gender === 'M'}
                onChange={(ev) =>
                  setUser({
                    ...user,
                    gender: ev.target.value,
                  })
                }
              />
              Guy
            </label>
            <label>
              <input
                type="radio"
                value="F"
                checked={user.gender === 'F'}
                onChange={(ev) =>
                  setUser({
                    ...user,
                    gender: ev.target.value,
                  })
                }
              />
              Chick
            </label>
          </div>
        </div>
        <div id="game-options">
          <div id="create-game" className="game-option">
            <h2>Create a new game</h2>
            <input
              name="custom-code"
              type="text"
              placeholder="custom code"
              value={customCode}
              onChange={(ev) => setCustomCode(ev.target.value)}
            />
            <button
              id="create-game"
              onClick={onClickCreate}
              disabled={createButtonDisabled()}
            >
              Create
            </button>
          </div>

          <div id="join-game" className="game-option">
            <h2>Or join with existing room code</h2>
            <input
              name="game-code"
              type="text"
              placeholder="join code"
              value={joinCode}
              onChange={(ev) => setJoinCode(ev.target.value)}
            />
            <button
              id="join-game"
              onClick={onClickJoin}
              disabled={joinButtonDisabled()}
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Form;
