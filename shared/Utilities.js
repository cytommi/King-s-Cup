const EventTypes = require("./EventTypes");

module.exports = {
  getCard: (val) => {
    if (val < 1 || val > 52)
      throw new Error("Card value has to be between 1 and 52 (inclusive)");

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
          eventName: EventTypes.game[numVal],
        };

      case 1:
        return {
          imageName: `${faceVal}_of_diamonds`,
          suit: "diamonds",
          val: numVal,
          eventName: EventTypes.game[numVal],
        };
      case 2:
        return {
          imageName: `${faceVal}_of_hearts`,
          suit: "hearts",
          val: numVal,
          eventName: EventTypes.game[numVal],
        };
      case 3:
        return {
          imageName: `${faceVal}_of_spades`,
          suit: "spades",
          val: numVal,
          eventName: EventTypes.game[numVal],
        };
      default:
        throw new Error("Something is wrong with your math");
    }
  },
};
