import { parseCard } from '../../../../shared/Utilities';

const images = {};

Array.from(Array(52).keys()).forEach(async (i) => {
  const cardName = parseCard(i + 1).imageName;
  let img = await import(`./${cardName}.png`);
  images[cardName] = img.default;
});
export default images;
