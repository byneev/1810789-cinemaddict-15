import AbstractElement from './abstract-element.js';

const getMoreButton = () => '<button class="films-list__show-more">Show more</button>';

export default class MoreButton extends AbstractElement {
  getTemplate() {
    return getMoreButton();
  }
}
