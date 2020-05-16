import React, { useEffect, useContext } from 'react';
import { useHistory, useParams, Redirect } from 'react-router-dom';
import { GlobalContext } from '../../context/Global';
import { GameContext } from '../../context/Game';
import CenterPan from './CenterPan';
import LeftPan from './LeftPan';
import RightPan from './RightPan';
import GameEvents from '../../../../shared/GameEvents';

/** Components */
import TopNav from './TopNav';

import '../../styling/game/base.scss';

const {
  BEGIN_COUNTDOWN,
  FLIP_CARD,
  SHOW_FORM,
  SHOW_ANNOUNCEMENT,
  BEGIN_ROUND,
  BROADCAST,
} = GameEvents.server;

const Game = () => {
  const { socket, user } = useContext(GlobalContext);
  const [gameState, dispatch] = useContext(GameContext);
  const history = useHistory();
  const { roomcode } = useParams();
  if (user.room !== roomcode) return <Redirect to="/" />;

  useEffect(() => {
    socket.emit(GameEvents.client.JOIN_GAME, { ...user });

    socket.on(BROADCAST.DATA_SYNC, (latestState) => {
      dispatch({
        type: BROADCAST.DATA_SYNC,
        payload: latestState,
      });
    });

    socket.on(BROADCAST.NEW_MEMBER, (players) => {
      dispatch({
        type: BROADCAST.NEW_MEMBER,
        payload: players,
      });
    });

    socket.on(BEGIN_COUNTDOWN, () =>
      dispatch({
        type: BEGIN_COUNTDOWN,
      })
    );

    socket.on(FLIP_CARD, ({ topCard }) => {
      dispatch({
        type: FLIP_CARD,
        payload: topCard,
      });
    });

    socket.on(SHOW_FORM, () => {
      dispatch({
        type: SHOW_FORM,
      });
    });

    socket.on(SHOW_ANNOUNCEMENT, () => {
      dispatch({
        type: SHOW_ANNOUNCEMENT,
      });
    });

    socket.on(BEGIN_ROUND, () => {
      dispatch({
        type: BEGIN_ROUND,
      });
    });

    return () => socket.emit(GameEvents.client.QUIT_GAME);
  }, []);
  return (
    <div id="game">
      <TopNav />
      <LeftPan />
      <CenterPan />
      <RightPan />
    </div>
  );
};

export default Game;
