const getRandomInteger = (start = 0, end = 1) => Math.floor(start + Math.random() * (end - start + 1));

const getRandomFloat = (start = 0, end = 10, count = 1) => (start + Math.random() * (end - start)).toFixed(count);

export { getRandomInteger, getRandomFloat };
