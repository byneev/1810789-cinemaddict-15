const getRandomInteger = (start = 0, end = 1) => Math.floor(start + Math.random() * (end - start + 1));

const getRandomFloat = (start = 4, end = 10, count = 1) => (start + Math.random() * (end - start)).toFixed(count);

const generateValuesFromArray = (array) => array.sort(() => Math.random() - Math.random()).slice(0, Math.floor(getRandomInteger(1, array.length / 3)));

const createElement = (template) => {
  const temp = document.createElement('div');
  temp.innerHTML = template;
  return temp.firstChild;
};

export { getRandomInteger, getRandomFloat, generateValuesFromArray, createElement };
