import DynamoDB from '../../services/dynamo.js';

const dynamoDB = new DynamoDB();
const tableDynamo = process.env.DYNAMO_TABLE_USERS;

export default class UsersRepository {
  async getByEmail(email) {
    try {
      const user = await dynamoDB.query(tableDynamo, {
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email },
      });

      return user[0];
    } catch (error) {
      throw new Error(`Respositorio (getByEmail), ${error.message}`);
    }
  }
  async insert(user) {
    try {
      await dynamoDB.insert(user, tableDynamo);
    } catch (error) {
      throw new Error(`Respositorio (insert), ${error.message}`);
    }
  }

  async update(user) {
    try {
      const params = {
        Key: { id: user.id, email: user.email },
        UpdateExpression:
          'set #name = :n, #description = :d, #updateAt = :ua, #company = :c',
        ExpressionAttributeNames: {
          // '#email': 'email',
          '#name': 'name',
          '#description': 'description',
          '#updateAt': 'updateAt',
          '#company': 'company',
        },
        ExpressionAttributeValues: {
          // ':e': user.email,
          ':n': user.name,
          ':d': user.description,
          ':ua': user.updateAt,
          ':c': user.company,
        },
      };
      await dynamoDB.update(tableDynamo, params);
    } catch (error) {
      throw new Error(`Respositorio (update), ${error.message}`);
    }
  }

  async delete(id, email) {
    const params = {
      Key: {
        id: id,
        email: email,
      },
    };
    await dynamoDB.delete(tableDynamo, params);
  }
}
