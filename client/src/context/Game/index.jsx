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
  countdown: 0,
  cache: undefined,
  drinkers: [],
  mates: [],
  showMateForm: false,
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

  const beginCountdown = (secs) => {
    dispatch({
      type: GameActions.beginCountdown,
      payload: secs,
    });
  };

  const decCountdown = () => {
    dispatch({
      type: GameActions.decCountdown,
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

  const clearDrinkers = () => {
    dispatch({
      type: GameActions.clearDrinkers,
    });
  };
  const addMate = (name) => {
    dispatch({
      type: GameActions.addMate,
      payload: name,
    });
  };
  return (
    <GameContext.Provider
      value={{
        game,
        setGame,
        beginCountdown,
        decCountdown,
        endCountdown,
        setCache,
        updateGameFromCache,
        clearDrinkers,
        addMate,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
