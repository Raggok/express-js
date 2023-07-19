import { v4, validate } from 'uuid';

export default class UUID {
  makeId() {
    return v4();
  }

  isValid(id) {
    return validate(id);
  }
}
