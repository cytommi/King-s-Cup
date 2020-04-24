import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../context/Global';
import EventTypes from '../../../../shared/EventTypes';

const Form = () => {
	const { socket } = useContext(GlobalContext);

	const [ joinCode, setJoinCode ] = useState('');
	const [ customCode, setCustomCode ] = useState('');

	const onClickJoin = (ev) => {
		ev.preventDefault();
		socket.emit(EventTypes.client.JOIN_GAME, joinCode);
	};
	const onClickCreate = (ev) => {
		ev.preventDefault();
		socket.emit(EventTypes.client.CREATE_GAME, customCode);
	};

	return (
		<div className="forms-container">
			<form className="game-option">
				<h2>Create new game and play with friends</h2>
				<input
					name="custom-code"
					type="text"
					placeholder="custom code"
					value={customCode}
					onChange={(ev) => setCustomCode(ev.target.value)}
				/>
				<button id="create-game" onClick={onClickCreate}>
					Create
				</button>
			</form>
			<form className="game-option">
				<h2>Join Code</h2>
				<input
					name="game-code"
					type="text"
					placeholder="join code"
					value={joinCode}
					onChange={(ev) => setJoinCode(ev.target.value)}
				/>
				<button id="join-game" onClick={onClickJoin}>
					Join
				</button>
			</form>
		</div>
	);
};

export default Form;
