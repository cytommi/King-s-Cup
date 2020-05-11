import React, { useContext, useEffect } from 'react';
import { useHistory, useParams, Redirect } from 'react-router-dom';
import { GlobalContext } from '../../context/Global';
import { GameContext } from '../../context/Game';
import EventTypes from '../../../../shared/EventTypes';
import TopNav from './TopNav';
import GamePlayers from './GamePlayers';
import Mates from './Mates';
import { Heaven, Floor } from './GameButtons';
import Cards from './Cards';
import Popup from './Popup';
import MateForm from './MateForm';
import Timer from './Timer';
import '../../styling/game/base.scss';

const Game = () => {
  const { roomcode } = useParams();
  const { user, socket, resetUser } = useContext(GlobalContext);
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
        setGame({
          players,
          currentPlayer,
        });
      }
    );
    socket.on(EventTypes.server.BROADCAST.DRINKERS, (drinkers) => {
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
      // updateGameFromCache();
    });

    joinSocket();
    return () => {
      socket.emit(EventTypes.client.LEAVE_GAME);
      resetUser();
    };
  }, []);

  return (
    <>
      <div id="game">
        <TopNav />
        <Heaven />
        <Cards />
        <Floor />
        <GamePlayers />
        <Mates />
        <Timer />
      </div>
      <MateForm />
      <Popup />
    </>
  );
};

export default Game;
