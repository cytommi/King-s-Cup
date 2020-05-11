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
};
