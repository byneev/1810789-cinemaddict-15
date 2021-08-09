import dayjs from 'dayjs';
import { AUTHORS, MESSAGES, EMOTIONS } from '../constants';
import { getRandomInteger, generateCommentId } from '../utils';

const generateComment = () => ({
  id: generateCommentId(),
  author: AUTHORS[getRandomInteger(0, AUTHORS.length - 1)],
  message: MESSAGES[getRandomInteger(0, MESSAGES.length - 1)],
  date: dayjs().add(-getRandomInteger(0, 365), 'day').toDate(),
  emotion: `/images/emoji/${EMOTIONS[getRandomInteger(0, EMOTIONS.length - 1)]}.png`,
});

export { generateComment };
