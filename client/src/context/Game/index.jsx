import React, { createContext, useReducer } from 'react';
import GameReducer from './Reducer';

const initialState = {
  phase: undefined,
  players: [],
  currentPlayer: [],
  currentCard: {},
  drinksHad: 0,
};

export const GameContext = createContext(initialState);

export const GameProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(GameReducer, initialState);

  return (
    <GameContext.Provider value={[gameState, dispatch]}>
      {children}
    </GameContext.Provider>
  );
};
