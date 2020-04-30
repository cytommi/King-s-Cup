import GameActions from './GameActions';

const GameReducer = (state, action) => {
	switch (action.type) {
		case GameActions.setGame:
			return {
				...state,
				...action.payload
			};

		case GameActions.setPlayers:
			console.log('here', { payload: action.payload });
			return {
				...state,
				players: action.payload
			};
		case GameActions.cardDrawn:
			return state;
		default:
			console.log('wtf');
			return state;
	}
};

export default GameReducer;
