import React, { createContext, useReducer } from 'react';
import GameReducer from './Reducer';

const initialState = {
  phase: undefined,
  players: [],
  currentPlayer: -1,
  currentCard: {},
  drinksHad: 0,
  mates: [],
  announcement: undefined,
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
