const GameLegend = require("./GameLegend");

module.exports = {
  CardDeck: () => {
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };
    let deck = Array.from(Array(52)).map((e, i) => i + 1);
    shuffleArray(deck);
    return deck;
  },

  parseCard: (val) => {
    if (val > 52) throw new Error("Card value has to be less than 52");
    if (val < 1) return null;

    let numVal = ((val - 1) % 13) + 1;
    const suit = (val - numVal) / 13;

    let faceVal = numVal;
    switch (numVal) {
      case 1:
        faceVal = `ace`;
        break;
      case 11:
        faceVal = `jack`;
        break;
      case 12:
        faceVal = `queen`;
        break;
      case 13:
        faceVal = `king`;
        break;
      default:
        break;
    }

    switch (suit) {
      case 0:
        return {
          imageName: `${faceVal}_of_clubs`,
          suit: "clubs",
          val: numVal,
          eventName: GameLegend[numVal].name,
        };

      case 1:
        return {
          imageName: `${faceVal}_of_diamonds`,
          suit: "diamonds",
          val: numVal,
          eventName: GameLegend[numVal].name,
        };
      case 2:
        return {
          imageName: `${faceVal}_of_hearts`,
          suit: "hearts",
          val: numVal,
          eventName: GameLegend[numVal].name,
        };
      case 3:
        return {
          imageName: `${faceVal}_of_spades`,
          suit: "spades",
          val: numVal,
          eventName: GameLegend[numVal].name,
        };
      default:
        throw new Error("Something is wrong with your math");
    }
  },

  parseUserInfo: (str) => {
    return str.split("_");
  },
};
