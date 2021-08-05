import dayjs from 'dayjs';
import { AUTHORS, MESSAGES, EMOTIONS } from '../constants';
import { getRandomInteger, generateCommentId } from '../utils';

const generateAuthor = () => AUTHORS[getRandomInteger(0, AUTHORS.length - 1)];

const generateMessage = () => MESSAGES[getRandomInteger(0, MESSAGES.length - 1)];

const generateCommentDate = () => dayjs().add(-getRandomInteger(0, 365), 'day').toDate();

const generateEmotion = () => `/images/emoji/${EMOTIONS[getRandomInteger(0, EMOTIONS.length - 1)]}.png`;

const generateComment = () => ({
  id: generateCommentId(),
  author: generateAuthor(),
  message: generateMessage(),
  date: generateCommentDate(),
  emotion: generateEmotion(),
});

export { generateComment };
