import GameActions from './GameActions';

const GameReducer = (state, action) => {
  switch (action.type) {
    case GameActions.setGame:
      return {
        ...state,
        ...action.payload,
      };

    case GameActions.beginCountdown:
      return {
        ...state,
        showCountdown: true,
      };
    case GameActions.endCountdown:
      return {
        ...state,
        showCountdown: false,
      };

    case GameActions.setCache:
      return {
        ...state,
        cache: action.payload,
      };

    case GameActions.updateGameFromCache:
      return {
        ...state,
        ...state.cache,
        cache: undefined,
      };

    default:
      throw new Error('Something wrong here in the Game Reducer');
  }
};

export default GameReducer;
