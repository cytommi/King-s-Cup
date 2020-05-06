import React, { useContext, useEffect } from 'react';
import { useHistory, useParams, Redirect } from 'react-router-dom';
import { GlobalContext } from '../../context/Global';
import { GameContext } from '../../context/Game';
import EventTypes from '../../../../shared/EventTypes';
import GameEvent from './GameEvent';
import GamePlayers from './GamePlayers';
import GameButtons from './GameButtons';
import Cards from './Cards';
import Drinkers from './Drinkers';
import '../../styling/game.scss';

import Timer from './Timer';

const Game = () => {
  const { roomcode } = useParams();
  const { user, socket } = useContext(GlobalContext);
  const {
    setGame,
    beginCountdown,
    setCache,
    updateGameFromCache,
    clearDrinkers,
  } = useContext(GameContext);
  const history = useHistory();

  if (roomcode !== user.room) {
    return <Redirect to="/"></Redirect>;
  }
  useEffect(() => {
    console.log('INDEX RERENDER');
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
    socket.on(EventTypes.server.BROADCAST.DRINKERS, (drinkers) => {
      console.log({ drinkers });
      setGame({
        drinkers,
      });
    });

    socket.on(EventTypes.server.CARD_FLIPPED, ({ card, nextPlayerIndex }) => {
      clearDrinkers();
      beginCountdown(3);
      setGame({
        currentPlayer: -1,
      });
      setCache({
        currentPlayer: nextPlayerIndex,
        topCard: card,
      });
      /** comment this out */
      updateGameFromCache();
    });

    joinSocket();
  }, []);

  return (
    <>
      <GameEvent />
      <GamePlayers />
      <GameButtons />
      <Cards />
      <Drinkers />
      {/* <Timer /> */}
    </>
  );
};

export default Game;
