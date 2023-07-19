import 'dotenv/config';
import jwt from 'jsonwebtoken';

export default class JWT {
  sign(user) {
    return jwt.sign(user, process.env.SECRET_KEY);
  }

  verify(token) {
    return jwt.verify(token, process.env.SECRET_KEY);
  }
}
