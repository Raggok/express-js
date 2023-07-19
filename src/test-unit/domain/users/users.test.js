import Users from '../../../domain/users/users.js';
import UsersRepository from '../../../domain/users/users-repository.js';

import JWT from '../../../services/jwt';

jest.mock('../../../services/uuid.js', () => {
  return jest.fn().mockImplementation(() => {
    return {
      makeId: jest.fn().mockReturnValue('testId'),
    };
  });
});

jest.mock('../../../services/jwt.js');

jest.mock('../../../domain/users/users-repository.js');

describe('Domain Users', () => {
  let users;
  const date = '2020-05-13 12:33';

  const name = 'name user',
    email = 'user@gmail.com',
    description = 'user test',
    company = 'EFINFO';

  const user = {
    id: 'testId',
    name,
    email,
    description,
    budget: 0,
    status: 'active',
    createAt: date,
    updateAt: null,
    company,
  };

  beforeEach(() => {
    users = new Users();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('add user', () => {
    test('should insert user', async () => {
      Date.now = jest.fn(() => new Date(date));

      const token = 'tokenUser';

      JWT.prototype.sign.mockReturnValue(token);
      UsersRepository.prototype.getByEmail.mockReturnValue(null);
      UsersRepository.prototype.insert.mockReturnValue('insert');

      const result = await users.add(name, email, description, company);

      expect(UsersRepository.prototype.getByEmail).toHaveBeenCalledTimes(1);
      expect(UsersRepository.prototype.getByEmail).toBeCalledWith(email);

      expect(UsersRepository.prototype.insert).toHaveBeenCalledTimes(1);
      expect(UsersRepository.prototype.insert).toBeCalledWith(user);

      expect(JWT.prototype.sign).toHaveBeenCalledTimes(1);
      expect(JWT.prototype.sign).toBeCalledWith(
        { name, email },
        process.env.SECRET_KEY
      );

      expect(result).toEqual(token);
    });

    test('should not insert user if the user already exist', async () => {
      UsersRepository.prototype.getByEmail.mockReturnValue('user');

      const addPromise = users.add(name, email, description);
      await expect(addPromise).rejects.toMatchInlineSnapshot(
        `[Error: Registro de usuario, el correo ya se encuentra registrado]`
      );
    });
  });

  describe('getUserByEmail', () => {
    test('should return user', async () => {
      UsersRepository.prototype.getByEmail.mockReturnValue(user);

      const result = await users.getByEmail(email);

      expect(UsersRepository.prototype.getByEmail).toHaveBeenCalledTimes(1);
      expect(UsersRepository.prototype.getByEmail).toBeCalledWith(email);

      expect(result).toEqual(user);
    });

    test('should not return user if not exist', async () => {
      UsersRepository.prototype.getByEmail.mockReturnValue(null);

      const result = users.getByEmail(email);

      await expect(result).rejects.toMatchInlineSnapshot(
        `[Error: Obtener usuario, no se encontro usuario con el correo:user@gmail.com]`
      );
    });
  });

  describe('updateUser', () => {
    const userUpdate = {
      ...user,
      name: 'update name',
      updateAt: date,
      description: 'update description',
      company: 'update comapy',
    };

    test('should return user update', async () => {
      Date.now = jest.fn(() => new Date(date));

      UsersRepository.prototype.getByEmail.mockReturnValue(user);

      const result = await users.update(
        userUpdate.name,
        email,
        userUpdate.description,
        userUpdate.company
      );

      expect(UsersRepository.prototype.getByEmail).toHaveBeenCalledTimes(1);
      expect(UsersRepository.prototype.getByEmail).toBeCalledWith(email);

      expect(UsersRepository.prototype.update).toHaveBeenCalledTimes(1);
      expect(UsersRepository.prototype.update).toBeCalledWith(userUpdate);

      expect(result).toEqual(userUpdate);
    });

    test('should throw error if user no exist', async () => {
      UsersRepository.prototype.getByEmail.mockReturnValue(null);

      const result = users.update(
        userUpdate.name,
        email,
        userUpdate.description
      );

      await expect(result).rejects.toMatchInlineSnapshot(
        `[Error: Actualizar usuario, no se encontro usuario con el correo:user@gmail.com]`
      );
    });
  });
});
