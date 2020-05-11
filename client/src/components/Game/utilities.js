export const parseUserInfo = (str) => {
  const name = str.slice(0, -1);
  const gender = str.slice(-1);
  return [name, gender];
};
