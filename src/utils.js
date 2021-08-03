const getRandomInteger = (start = 0, end = 1) => Math.floor(start + Math.random() * (end - start + 1));

const getRandomFloat = (start = 0, end = 10, count = 1) => (start + Math.random() * (end - start)).toFixed(count);

const ids = [];

const generateId = () => {
  let id;
  do {
    id = getRandomInteger(1, 100);
  } while (ids.includes(id));
  ids.push(id);
  return id;
};

export { getRandomInteger, getRandomFloat, generateId };
