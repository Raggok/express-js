import Logs from '../../domain/logs/logs.js';
import LogsRepository from '../../domain/logs/logs-repository.js';
jest.setTimeout(30000);

const logsRepository = new LogsRepository();

describe('Logs integration tests', () => {
  const logs = new Logs();
  const controller = 'testController';
  const model = 'testModel';
  const text_request = 'testTextRequest';
  const response = 'testResponse';
  const createAt = '2023-05-03 10:00:00';
  const cost = 1.23;
  const time = 100;
  const userId = 'testUserId';

  it('should add a new log', async () => {
    await logs.add(
      controller,
      model,
      text_request,
      response,
      createAt,
      cost,
      time,
      userId
    );

    const logsList = await logs.getByDate('2023-05-03');

    expect(logsList[0].time).toBe(time);
    expect(logsList[0].cost).toBe(cost);
    expect(logsList[0].model).toBe(model);
    expect(logsList[0].userId).toBe(userId);
    expect(logsList[0].response).toBe(response);
    expect(logsList[0].createAt).toBe(createAt);
    expect(logsList[0].controller).toBe(controller);
    expect(logsList[0].text_request).toBe(text_request);

    await logsRepository.delete(logsList);
  });

  it('should return logs by date', async () => {
    // Se agregan dos logs con fechas distintas
    await logs.add(
      controller,
      model,
      'testTextRequest2',
      response,
      createAt,
      cost,
      time,
      userId
    );
    await logs.add(
      controller,
      model,
      text_request,
      response,
      '2023-05-02 10:00:00',
      cost,
      time,
      userId
    );
    await logs.add(
      controller,
      model,
      text_request,
      response,
      '2023-05-03 12:00:00',
      cost,
      time,
      userId
    );
    const logsList = await logs.getByDate('2023-05-03');

    expect(logsList.length).toBe(2);
    await logsRepository.delete(logsList);
  });
});
