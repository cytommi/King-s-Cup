module.exports = {
  client: {
    JOIN_GAME: "join-game",
    LEAVE_GAME: "leave-game",
    INFO_RESPONSE: "info-response",
    FLIP_CARD: "flip-card",
  },
  server: {
    BROADCAST: {
      NEW_MEMBER: "broadcast-new-member",
      DELETE_MEMBER: "broadcast-delete-member",
    },
    ERROR: {
      INVALID_JOIN_CODE: "error-invalid-join-code",
      DUPLICATE_CUSTOM_CODE: "error-duplicate-custom-code",
    },
    INFO_REQUEST: "info-request",
    JOIN_GAME_SUCCESS: "join-game-success",
    CREATE_GAME_SUCCESS: "create-game-success",
    CARD_FLIPPED: "card-flipped",
  },
  game: {
    1: "waterfall",
    2: "you",
    3: "me",
    4: "floor",
    5: "guys",
    6: "chicks",
    7: "heaven",
    8: "mate",
    9: "rhyme",
    10: "categories",
    11: "never have I ever",
    12: "questions",
    13: "king's cup",
  },
};
