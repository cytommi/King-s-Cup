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

  return (
    <GameContext.Provider value={{ game, setGame }}>
      {children}
    </GameContext.Provider>
  );
};
