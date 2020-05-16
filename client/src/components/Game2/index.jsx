import React, { useContext, useEffect } from 'react';
import { useHistory, useParams, Redirect } from 'react-router-dom';
import { GlobalContext } from '../../context/Global';
import { GameContext } from '../../context/Game2';

const Game = () => {
  const { roomcode } = useParams();
  const { user, socket, resetUser } = useContext(GlobalContext);
  const {} = useContext(GameContext);
  const history = useHistory();

  if (roomcode !== user.room) {
    return <Redirect to="/"></Redirect>;
  }

  useEffect(() => {
    socket.emit(EventTypes.client.JOIN_GAME, {
      ...user,
    });

    return () => {
      socket.emit(EventTypes.client.LEAVE_GAME);
      resetUser();
    };
  }, []);
};

export default Game;
