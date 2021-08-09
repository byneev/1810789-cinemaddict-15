const getRandomInteger = (start = 0, end = 1) => Math.floor(start + Math.random() * (end - start + 1));

const getRandomFloat = (start = 4, end = 10, count = 1) => (start + Math.random() * (end - start)).toFixed(count);

let idCount = 0;
let commentIdCount = 0;

const generateId = () => ++idCount;
const generateCommentId = () => ++commentIdCount;

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

export { getRandomInteger, getRandomFloat, generateId, generateCommentId, generateValuesFromArray };
