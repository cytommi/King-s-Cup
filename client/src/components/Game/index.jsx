import React, { useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { GlobalContext } from '../../context/Global';
import { GameContext } from '../../context/Game';
import EventTypes from '../../../../shared/EventTypes';
import GameStatus from './GameStatus';
import '../../styling/game.scss';


const GameRouteGuard = ({ children }) => {
	const history = useHistory();
	const { user } = useContext(GlobalContext);
	const { roomcode } = useParams();
	if (roomcode !== user.room) {
		history.push(`/`);
	}
	return children;
};

const Game = () => {
	// const history = useHistory();
	const { roomcode } = useParams();
	const { user, socket } = useContext(GlobalContext);
	const { state, setGame, setPlayers } = useContext(GameContext);

	useEffect(() => {
		const joinSocket = async () => {
			const res = await fetch(`${process.env.API_URL}/game/${roomcode}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				},
				body: JSON.stringify({ name: user.name })
			});
			if (res.ok) {
				console.log('Joined socket room');
				const data = await res.json();
				setGame({
					...state,
					players: data.players,
					currentDeck: data.currentDeck
				});
				socket.emit(EventTypes.client.JOIN_GAME, { name: user.name, room: user.room });
			} else {
				console.log('error joining socket room');
			}
		};

		socket.on(EventTypes.server.BROADCAST.NEW_MEMBER, ({ message, payload }) => {
			console.log({message, payload});
			setPlayers(payload);
		});

		joinSocket();
	}, []);

	return (
		<GameRouteGuard>
			<h1>Welcome, {user.name} to the Game of King's Cup</h1>
			<GameStatus />
		</GameRouteGuard>
	);
};

export default Game;
