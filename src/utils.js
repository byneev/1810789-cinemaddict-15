const RenderPosition = {
  BEFOREEND: 'beforeend',
  AFTERBEGIN: 'afterbegin',
};

const getRandomInteger = (start = 0, end = 1) => Math.floor(start + Math.random() * (end - start + 1));

const getRandomFloat = (start = 4, end = 10, count = 1) => (start + Math.random() * (end - start)).toFixed(count);

const generateValuesFromArray = (array) => {
  const resultArray = [];
  for (const item of array) {
    if (getRandomInteger(1, 4) === 1) {
      resultArray.push(item);
    }
  }
  if (resultArray.length === 0) {
    resultArray.push(array[getRandomInteger(0, array.length - 1)]);
  }
  return resultArray;
};

const createElement = (template) => {
  const temp = document.createElement('div');
  temp.innerHTML = template;
  return temp.firstChild;
};

const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export { getRandomInteger, getRandomFloat, generateValuesFromArray, createElement, render, RenderPosition };
