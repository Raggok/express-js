import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
});

const db = new AWS.DynamoDB.DocumentClient();

export default class DynamoDB {
  async insert(params, table) {
    try {
      const itemParams = {
        Item: { ...params },
        TableName: table,
      };

      await db.put(itemParams).promise();
    } catch (error) {
      throw new Error(`insert dynamoDB: ${error.message}`);
    }
  }

  async query(table, params) {
    try {
      const paramsScan = {
        TableName: table,
        ...params,
      };

      const result = await db.scan(paramsScan).promise();

      return result.Items;
    } catch (error) {
      throw new Error(`scan dynamoDB: ${error.message}`);
    }
  }

  async update(table, params) {
    try {
      const paramsUpdate = {
        TableName: table,
        ...params,
      };

      await db.update(paramsUpdate).promise();
    } catch (error) {
      throw new Error(`scan update: ${error.message}`);
    }
  }

  async delete(table, params) {
    try {
      const paramsDelete = {
        TableName: table,
        ...params,
      };

      await db
        .delete(paramsDelete, (err, result) => {
          // console.log({ err, result });
        })
        .promise();
    } catch (error) {
      throw new Error(`scan delete: ${error.message}`);
    }
  }

  async deleteItem(items, tableName) {
    for (const item of items) {
      const basededatos = new AWS.DynamoDB.DocumentClient();

      const params = {
        TableName: tableName,
        Key: {
          id: item.id,
        },
      };

      try {
        const data = await basededatos.delete(params).promise();
        // console.log('Elemento eliminado: ', data);
      } catch (err) {
        console.error('Error al eliminar elemento: ', err);
      }
    }
  }
}
