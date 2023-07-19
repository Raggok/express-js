import JWT from '../services/jwt.js';
import UsersRepository from '../domain/users/users-repository.js';

const jwt = new JWT();
const usersRepository = new UsersRepository();

const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }
  try {
    const decoded = jwt.verify(token);

    const user = await usersRepository.getByEmail(decoded.email);

    if (!user) {
      return res.status(401).send('Access denied. No user exist.');
    }

    req.user = user;

    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};
export default auth;
