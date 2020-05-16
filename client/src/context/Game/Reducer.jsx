import GameEvents from '../../../../shared/GameEvents';
import GamePhases from '../../../../shared/GamePhases';

const GameReducer = (state, action) => {
  switch (action.type) {
    case GameEvents.server.BEGIN_COUNTDOWN:
      return {
        ...state,
        phase: GamePhases.COUNTDOWN,
      };
    case GameEvents.server.FLIP_CARD:
      return {
        ...state,
        phase: GamePhases.CARD_REACTION_TIME,
        topCard: action.payload,
      };

    case GameEvents.server.SHOW_FORM:
      return {
        ...state,
        phase: GamePhases.PENDING_FORM_RESPONSES,
      };

    case GameEvents.server.SHOW_ANNOUNCEMENT:
      return {
        ...state,
        phase: GamePhases.PENDING_READY_RESPONSES,
      };

    case GameEvents.server.BEGIN_ROUND:
      return {
        ...state,
        phase: GamePhases.PENDING_CARD_CLICK,
      };

    /** BROADCAST EVENTS */
    case GameEvents.server.BROADCAST.DATA_SYNC:
      return {
        ...state,
        ...action.payload,
      };

    case GameEvents.server.BROADCAST.DATA_SYNC:
      return {
        ...state,
        players: action.payload,
      };
  }
};

export default GameReducer;
