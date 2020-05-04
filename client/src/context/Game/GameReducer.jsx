import GameActions from './GameActions';

const GameReducer = (state, action) => {
  switch (action.type) {
    case GameActions.setGame:
      return {
        ...state,
        ...action.payload,
      };

    case GameActions.setPlayers:
      return {
        ...state,
        players: action.payload,
      };
    case GameActions.setTopCard:
      return {
        ...state,
        topCard: action.payload,
      };

    default:
      throw new Error('Something wrong here in the Game Reducer');
  }
};

export default GameReducer;
