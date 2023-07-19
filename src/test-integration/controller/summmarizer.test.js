/* eslint-disable no-undef */
import LogsRepository from '../../domain/logs/logs-repository.js';

const logsRepository = new LogsRepository();

jest.setTimeout(30000);

describe('Summarizer', () => {
  const req = {
    user: {
      id: 'iduser',
      company: 'EFINFO',
    },
  };

  test('generate summarizer', async () => {
    const module = await import('../../controllers/summarizer.js');
    req.body = {
      controller: 'summarizer',
      model: 'davinci',
      prompt: 'realiza un resumen del siguiente texto:',
      text: 'El panista, quien es uno de los personajes señalados por el Presidente como uno de los convocantes de la manifestación, afirmó que «es un honor ser fichado por Obrador.\n «Una vez más, el compañero presidente @lopezobrador_ hizo el favor de mencionarme en su mañanera como parte de su lista de personajes favoritos que asistieron ayer a la histórica convocatoria del zócalo. Está que revienta el coraje del señor», posteó',
      temperature: 0.5,
      top_p: 0.2,
      frequency_penalty: 1,
      presence_penalty: 0,
      extra: { digest: '22b430571b3d630b6ec88a2ae1adc1a6' },
    };

    const result = await module.default(req);

    expect(result).toMatchObject({
      summary: expect.any(String),
      time: expect.any(String),
      registerId: expect.any(String),
    });

    await deleteLog(result.registerId);
  });

  test('should summarize the text using default parameters', async () => {
    req.body = {
      controller: 'summarizer',
      text: 'El panista, quien es uno de los personajes señalados por el Presidente como uno de los convocantes de la manifestación, afirmó que «es un honor ser fichado por Obrador.\n «Una vez más, el compañero presidente @lopezobrador_ hizo el favor de mencionarme en su mañanera como parte de su lista de personajes favoritos que asistieron ayer a la histórica convocatoria del zócalo. Está que revienta el coraje del señor», posteó',
      extra: { digest: '22b430571b3d630b6ec88a2ae1adc1a6' },
    };

    const module = await import('../../controllers/summarizer.js');
    const result = await module.default(req);

    expect(result).toMatchObject({
      summary: expect.any(String),
      time: expect.any(String),
      registerId: expect.any(String),
    });

    await deleteLog(result.registerId);
  });
});

async function deleteLog(id) {
  await logsRepository.delete([{ id }]);
}
