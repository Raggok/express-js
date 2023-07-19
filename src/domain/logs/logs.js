import UUID from '../../services/uuid.js';

import LogsRepository from './logs-repository.js';

const uuid = new UUID();
const logsRepository = new LogsRepository();

export default class Logs {
  async add(
    controller,
    model,
    text_request,
    response,
    createAt,
    cost,
    time,
    userId,
    extra
  ) {
    try {
      const id = uuid.makeId();
      const log = {
        id,
        controller,
        model,
        text_request,
        response,
        createAt,
        cost,
        time,
        userId,
        extra,
      };

      await logsRepository.insert(log);
      return id;
    } catch (error) {
      throw new Error(`Registro de log, ${error.message}`);
    }
  }

  async getByDate(date) {
    try {
      return await logsRepository.getByDate(date);
    } catch (error) {
      throw new Error(`Obtener logs, ${error.message}`);
    }
  }
}
