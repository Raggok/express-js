import moment from 'moment';
import JWT from '../../services/jwt.js';
import UUID from '../../services/uuid.js';

import UsersRepository from './users-repository.js';

const jwt = new JWT();
const uuid = new UUID();
const usersRepository = new UsersRepository();

export default class Users {
  async add(name, email, description, company) {
    try {
      let user = await usersRepository.getByEmail(email);

      if (user) {
        throw new Error(`el correo ya se encuentra registrado`);
      }

      user = {
        id: uuid.makeId(),
        name: name,
        email: email,
        description: description ? description : null,
        budget: 0,
        status: 'active',
        createAt: moment().format('YYYY-MM-DD HH:mm'),
        updateAt: null,
        company,
      };

      await usersRepository.insert(user);

      const token = jwt.sign({ name, email }, process.env.SECRET_KEY);

      return token;
    } catch (error) {
      throw new Error(`Registro de usuario, ${error.message}`);
    }
  }

  async getByEmail(email) {
    try {
      if (!email) {
        throw new Error(`indica el correo`);
      }

      let user = await usersRepository.getByEmail(email);

      if (!user) {
        throw new Error(`no se encontro usuario con el correo:${email}`);
      }

      return user;
    } catch (error) {
      throw new Error(`Obtener usuario, ${error.message}`);
    }
  }

  async update(name, email, description, company) {
    try {
      if (!email) {
        throw new Error(`indica el correo`);
      }

      let user = await usersRepository.getByEmail(email);

      if (!user) {
        throw new Error(`no se encontro usuario con el correo:${email}`);
      }
      if (name) user.name = name;
      if (description) user.description = description;
      if (company) user.company = company;
      user.updateAt = moment().format('YYYY-MM-DD HH:mm');

      await usersRepository.update(user);
      return user;
    } catch (error) {
      throw new Error(`Actualizar usuario, ${error.message}`);
    }
  }
}
