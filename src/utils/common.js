import AbstractElement from '../view/abstract-element';

const getRandomInteger = (start = 0, end = 1) => Math.floor(start + Math.random() * (end - start + 1));

const getRandomFloat = (start = 4, end = 10, count = 1) => (start + Math.random() * (end - start)).toFixed(count);

const generateValuesFromArray = (array) =>
  array.sort(() => Math.random() - Math.random()).slice(0, Math.floor(getRandomInteger(1, array.length / 3)));

const createElement = (template) => {
  const temp = document.createElement('div');
  temp.innerHTML = template;
  return temp.firstChild;
};

const remove = (component) => {
  component.getElement.remove();
  component.removeElement();
};

const replace = (newChild, oldChild) => {
  if (newChild instanceof AbstractElement) {
    newChild = newChild.getElement();
  }
  if (oldChild instanceof AbstractElement) {
    oldChild = oldChild.getElement();
  }
  const parent = oldChild.parentElement;
  parent.replaceChild(newChild, oldChild);
};

export { getRandomInteger, getRandomFloat, generateValuesFromArray, createElement, remove, replace };
