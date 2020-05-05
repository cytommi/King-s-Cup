import React, { useContext, useEffect } from 'react';
import { useHistory, useParams, Redirect } from 'react-router-dom';
import { GlobalContext } from '../../context/Global';
import { GameContext } from '../../context/Game';
import EventTypes from '../../../../shared/EventTypes';
import GameEvent from './GameEvent';
import GamePlayers from './GamePlayers';
import GameButtons from './GameButtons';
import Cards from './Cards';
import '../../styling/game.scss';

import Timer from './Timer';

const Game = () => {
  const { roomcode } = useParams();
  const { user, socket } = useContext(GlobalContext);
  const { game, setGame, beginCountdown, setCache } = useContext(GameContext);
  const history = useHistory();

  if (roomcode !== user.room) {
    return <Redirect to="/"></Redirect>;
  }
  useEffect(() => {
    const joinSocket = async () => {
      const res = await fetch(`${process.env.API_URL}/game/${roomcode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ name: user.name, gender: user.gender }),
      });
      if (res.ok) {
        const { players, currentDeck, currentPlayer } = await res.json();
        setGame({
          players,
          currentDeck,
          currentPlayer,
        });
        socket.emit(EventTypes.client.JOIN_GAME, {
          name: user.name,
          room: user.room,
          gender: user.gender,
        });
      } else {
        console.log('Error joining game. Redirecting back to home page.');
        history.push('/');
      }
    };

    socket.on(EventTypes.server.BROADCAST.NEW_MEMBER, ({ players }) => {
      setGame({ players });
    });

    socket.on(
      EventTypes.server.BROADCAST.DELETE_MEMBER,
      ({ players, currentPlayer }) => {
        console.log({ players, currentPlayer });
        setGame({
          players,
          currentPlayer,
        });
      }
    );

    socket.on(EventTypes.server.CARD_FLIPPED, ({ card, nextPlayerIndex }) => {
      beginCountdown();
      setCache({
        currentPlayer: nextPlayerIndex,
        topCard: card,
      });
    });

    joinSocket();
  }, []);

  return (
    <>
      <GameEvent />
      <GamePlayers />
      <GameButtons />
      <Cards />
      {game.showCountdown && <Timer seconds={3} />}
    </>
  );
};

export default Game;
