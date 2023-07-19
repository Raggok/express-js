import DynamoDB from '../../services/dynamo.js';

const dynamoDB = new DynamoDB();
const tableDynamo = process.env.DYNAMO_TABLE_LOGS;

export default class LogsRepository {
  async insert(log) {
    try {
      await dynamoDB.insert(log, tableDynamo);
    } catch (error) {
      throw new Error(`Respositorio (insert), ${error.message}`);
    }
  }

  async getByDate(date) {
    try {
      const params = {
        FilterExpression: '#date BETWEEN :startTime AND :endTime',
        ExpressionAttributeValues: {
          ':startTime': `${date} 00:00`,
          ':endTime': `${date} 23:59`,
        },
        ExpressionAttributeNames: { '#date': 'createAt' },
      };

      return await dynamoDB.query(tableDynamo, params);
    } catch (error) {
      throw new Error(`Respositorio (getByDate), ${error.message}`);
    }
  }

  async delete(items) {
    await dynamoDB.deleteItem(items, tableDynamo);
  }
}
