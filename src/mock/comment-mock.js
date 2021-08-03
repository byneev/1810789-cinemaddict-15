import dayjs from 'dayjs';
import { AUTHORS, MESSAGES, EMOTIONS } from '../constants';
import { getRandomInteger, generateId } from '../utils';

const generateAuthor = () => AUTHORS[getRandomInteger(0, AUTHORS.length - 1)];

const generateMessage = () => MESSAGES[getRandomInteger(0, MESSAGES.length - 1)];

const generateCommentDate = () => dayjs().add(-getRandomInteger(0, 365), 'day').toDate();

const generateEmotion = () => EMOTIONS[getRandomInteger(0, EMOTIONS.length - 1)];

const generateComment = () => ({
  id: generateId(),
  author: generateAuthor(),
  comment: generateMessage(),
  date: generateCommentDate(),
  emotion: generateEmotion(),
});

export { generateComment };
