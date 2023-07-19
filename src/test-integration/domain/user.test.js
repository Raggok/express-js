import Users from '../../domain/users/users.js';
import UsersRepository from '../../domain/users/users-repository.js';

const usersRepository = new UsersRepository();

jest.setTimeout(30000);
describe('Users integration tests', () => {
  const users = new Users();
  const name = 'John Doe';
  const email = 'johndoe@example.com';
  const description = 'Lorem ipsum dolor sit amet';
  const company = 'company';

  test('add, get, uptade user', async () => {
    const token = await users.add(name, email, description, company);

    expect(token).toBeTruthy();

    let user = await users.getByEmail(email);

    expect(user.name).toBe(name);
    expect(user.email).toBe(email);
    expect(user.description).toBe(description);
    expect(user.budget).toBe(0);
    expect(user.status).toBe('active');
    expect(user.company).toBe('company');
    expect(user.createAt).toBeTruthy();
    expect(user.updateAt).toBeNull();

    const updateName = 'Doe John';
    const updateDescription = 'description update';

    await users.update(updateName, email, updateDescription);

    user = await users.getByEmail(email);

    expect(user.name).toBe(updateName);
    expect(user.description).toBe(updateDescription);
    expect(user.budget).toBe(0);
    expect(user.status).toBe('active');
    expect(user.createAt).toBeTruthy();
    expect(user.updateAt).toBeTruthy();

    await usersRepository.delete(user.id, email);
  });

  test('throws an error when trying to add an existing user', async () => {
    const token1 = await users.add(name, email, description, company);
    let user = await users.getByEmail(email);

    expect(token1).toBeTruthy();

    const name2 = 'Jane Smith';
    const email2 = 'johndoe@example.com';
    const description2 = 'Consectetur adipiscing elit';

    await expect(
      users.add(name2, email2, description2, company)
    ).rejects.toThrow(
      'Registro de usuario, el correo ya se encuentra registrado'
    );

    await usersRepository.delete(user.id, email);
  });

  test('throws an error when trying to get a non-existing user', async () => {
    const email = 'johndoe@example.com';

    await expect(users.getByEmail(email)).rejects.toThrow(
      `no se encontro usuario con el correo:${email}`
    );
  });

  test('throws an error when trying to update a non-existing user', async () => {
    const email = 'johndoe@example.com';

    await expect(users.update('Doe John', email)).rejects.toThrow(
      `no se encontro usuario con el correo:${email}`
    );
  });
});
