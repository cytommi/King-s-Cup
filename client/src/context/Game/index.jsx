import React, { createContext, useReducer, useState } from 'react';
import GameActions from './GameActions';
import GameReducer from './GameReducer';

const initialState = {
  players: [],
  currentPlayer: 0 /** index */,
  currentDeck: [],
  topCard: {
    imageName: undefined,
    suit: undefined,
    val: 0,
    eventName: undefined,
  } /** cards are 1-indexed */,
  showCountdown: false,
  cache: undefined,
};

export const GameContext = createContext(initialState);

export const GameProvider = ({ children }) => {
  const [game, dispatch] = useReducer(GameReducer, initialState);

  const setGame = (gameStateChanges) => {
    dispatch({
      type: GameActions.setGame,
      payload: gameStateChanges,
    });
  };

  const beginCountdown = () => {
    dispatch({
      type: GameActions.beginCountdown,
    });
  };

  const endCountdown = () => {
    dispatch({
      type: GameActions.endCountdown,
    });
  };

  const setCache = (gameState) => {
    dispatch({
      type: GameActions.setCache,
      payload: gameState,
    });
  };

  const updateGameFromCache = () => {
    dispatch({
      type: GameActions.updateGameFromCache,
    });
  };

  return (
    <GameContext.Provider
      value={{
        game,
        setGame,
        beginCountdown,
        endCountdown,
        setCache,
        updateGameFromCache,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
