import Logs from '../../../domain/logs/logs.js';
import LogsRepository from '../../../domain/logs/logs-repository';

jest.mock('../../../services/uuid.js', () => {
  return jest.fn().mockImplementation(() => {
    return {
      makeId: jest.fn().mockReturnValue('testId'),
      validate: jest.fn(),
    };
  });
});
jest.mock('../../../domain/logs/logs-repository.js');

describe('Domain Logs', () => {
  let logs;
  const controller = 'summarizer',
    model = 'davinci',
    text_request =
      'Realiza un resumen: Las estrellas son cuerpos celestes gigantes, compuestos principalmente por hidrógeno y helio, que producen luz y calor desde sus arremolinadas fundiciones nucleares. ',
    response =
      'Las estrellas son cuerpos celestes gigantes, compuestos principalmente por hidrógeno y helio, que producen luz y calor desde sus arremolinadas.',
    createAt = '2023-03-08 13=25',
    cost = 0.123,
    time = 0.15,
    userId = '1dac46c4-1e6a-4591-826c-fac42ffa8e3b',
    extra = { company: 'EFINFO', digest: 'digest' };

  beforeEach(() => {
    logs = new Logs();
  });

  describe('add logs', () => {
    test('should insert log', async () => {
      LogsRepository.prototype.insert.mockReturnValue('insert');

      await logs.add(
        controller,
        model,
        text_request,
        response,
        createAt,
        cost,
        time,
        userId,
        extra
      );
      expect(LogsRepository.prototype.insert).toHaveBeenCalledTimes(1);

      expect(LogsRepository.prototype.insert).toBeCalledWith({
        id: 'testId',
        controller,
        model,
        text_request,
        response,
        createAt,
        cost,
        time,
        userId,
        extra,
      });
    });

    test('show throw an error if the insert fail ', async () => {
      LogsRepository.prototype.insert.mockRejectedValue(
        new Error('Error insert')
      );

      const addPromise = logs.add(
        controller,
        model,
        text_request,
        response,
        createAt,
        cost,
        time,
        userId,
        extra
      );

      await expect(addPromise).rejects.toThrow('Registro de log, Error insert');
    });
  });

  describe('getByDate', () => {
    const date = '2022-01-01';
    const resultLogs = ['log1', 'log2'];

    test('should return logs found by date', async () => {
      LogsRepository.prototype.getByDate.mockReturnValue(resultLogs);

      const result = await logs.getByDate(date);

      expect(LogsRepository.prototype.getByDate).toHaveBeenCalledTimes(1);
      expect(LogsRepository.prototype.getByDate).toBeCalledWith(date);

      expect(result).toEqual(resultLogs);
    });

    test('should throw an error if getByDate fail', async () => {
      LogsRepository.prototype.getByDate.mockRejectedValue(
        new Error('Error getByDate')
      );

      const getPromise = logs.getByDate(date);

      await expect(getPromise).rejects.toThrow('Obtener logs, Error getByDate');
    });
  });
});
