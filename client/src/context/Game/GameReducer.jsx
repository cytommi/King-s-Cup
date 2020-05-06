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
        countdown: action.payload,
      };
    case GameActions.decCountdown:
      return {
        ...state,
        countdown: state.countdown - 1,
      };
    case GameActions.endCountdown:
      return {
        ...state,
        countdown: 0,
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
    case GameActions.clearDrinkers:
      return {
        ...state,
        drinkers: [],
      };

    default:
      throw new Error('Something wrong here in the Game Reducer');
  }
};

export default GameReducer;
