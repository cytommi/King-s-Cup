import React, { useContext } from 'react';
import { GameContext } from '../../context/Game';

const GameStatus = () => {
	const { state } = useContext(GameContext);
	return (
		<div>
			<h1>Players</h1>
			<ul>{ state.players.length > 0 && state.players.map((player) => <li key={player}>{player}</li>)}</ul>
		</div>
	);
};

export default GameStatus;
