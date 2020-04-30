import React, { createContext, useReducer, useState } from 'react';
import GameActions from './GameActions';
import GameReducer from './GameReducer';

const initialState = {
	players: [],
	currentPlayer: 0 /** index */,
	currentDeck: [],
	topCard: ''
};

export const GameContext = createContext(initialState);

export const GameProvider = ({ children }) => {
	const [ state, dispatch ] = useReducer(GameReducer, initialState);

	const setGame = (gameState) => {
		dispatch({
			type: GameActions.setGame,
			payload: gameState
		});
	};

	const setPlayers = (players) => {
		dispatch({
			type: GameActions.setPlayers,
			payload: players
		});
	};

	const drawCard = () => {
		dispatch({
			type: GameActions.drawCard
		});
	};

	const cardDrawn = () => {
		dispatch({
			type: GameActions.cardDrawn
		});
	};

	return (
		<GameContext.Provider value={{ state, setGame, setPlayers, drawCard, cardDrawn }}>
			{children}
		</GameContext.Provider>
	);
};
