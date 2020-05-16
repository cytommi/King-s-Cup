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

  const createRequest = async (roomCode) => {
    return await fetch(`${process.env.API_URL}/game/${roomCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  };

  const joinRequest = async (roomCode, user) => {
    return await fetch(`${process.env.API_URL}/game/${roomCode}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        name: user.name,
        gender: user.gender,
      }),
    });
  };

  const onClickJoin = async (ev) => {
    ev.preventDefault();
    const res = await joinRequest(joinCode, user);
    if (res.ok) {
      setUser({
        ...user,
        room: joinCode /** AUTH */,
      });
      history.push(`/game/${joinCode}`);
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  const onClickCreate = async (ev) => {
    ev.preventDefault();
    const createRes = await createRequest(customCode);
    if (!createRes.ok) {
      const data = await createRes.json();
      setError(data.error);
      return;
    }
    const joinRes = await joinRequest(customCode, user);
    if (joinRes.ok) {
      setUser({
        ...user,
        room: customCode /** AUTH */,
      });
      history.push(`/game/${customCode}`);
    } else {
      const data = await joinRes.json();
      setError(data.error);
    }
  };

  return (
    <>
      <form>
        <div id="user-info" className="flex-item">
          <h2 id="info-header">PLAYER INFO</h2>
          <div id="name-input" className="player-info">
            <input
              name="name"
              type="text"
              value={user.name}
              placeholder="my name"
              onChange={(ev) =>
                setUser({
                  ...user,
                  name: ev.target.value,
                })
              }
            />
          </div>
          <div id="gender-input">
            <label htmlFor="gender-iuput">I am a: </label>
            <div className="M-option gender-input">
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
            </div>
            <div className="F-option gender-input">
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
        </div>

        <div id="create-game" className="flex-item game-option">
          <h2>CREATE A NEW GAME</h2>
          <input
            name="custom-code"
            type="text"
            placeholder="custom code"
            value={customCode}
            onChange={(ev) => setCustomCode(ev.target.value)}
          />
          <button
            id="create-game-button"
            onClick={onClickCreate}
            disabled={createButtonDisabled()}
          >
            CREATE
          </button>
        </div>

        <div id="join-game" className="flex-item game-option">
          <h2>OR JOIN EXISTING ROOM WITH CODE</h2>
          <input
            name="game-code"
            type="text"
            placeholder="join code"
            value={joinCode}
            onChange={(ev) => setJoinCode(ev.target.value)}
          />
          <button
            id="join-game-button"
            onClick={onClickJoin}
            disabled={joinButtonDisabled()}
          >
            JOIN
          </button>
        </div>
      </form>
      <h1 id="error-msg">{error}</h1>
    </>
  );
};

export default Form;
