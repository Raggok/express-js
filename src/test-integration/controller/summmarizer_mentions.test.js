/* eslint-disable no-undef */
import LogsRepository from '../../domain/logs/logs-repository.js';

const logsRepository = new LogsRepository();

jest.setTimeout(30000);

describe('Summarizer mentions', () => {
  const req = {
    user: {
      id: 'iduser',
      company: 'company',
    },
  };

  test('generate summarizer', async () => {
    const module = await import('../../controllers/summarizer_mentions.js');

    req.body = {
      controller: 'summarizer_mentions',
      model: 'davinci',
      prompt:
        'realiza un resumen que contenga alguna de las siguientes palabras:',
      text: 'El panista, quien es uno de los personajes señalados por el Presidente como uno de los convocantes de la manifestación, afirmó que «es un honor ser fichado por Obrador.\n «Una vez más, el compañero presidente @lopezobrador_ hizo el favor de mencionarme en su mañanera como parte de su lista de personajes favoritos que asistieron ayer a la histórica convocatoria del zócalo. Está que revienta el coraje del señor», posteó',
      temperature: 0.5,
      top_p: 0.2,
      mentions: ['presidente', 'panista', 'zocalo'],
      frequency_penalty: 1,
      presence_penalty: 0,
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
      controller: 'summarizer_mentions',
      mentions: ['presidente', 'panista', 'zocalo'],
      text: 'El panista, quien es uno de los personajes señalados por el Presidente como uno de los convocantes de la manifestación, afirmó que «es un honor ser fichado por Obrador.\n «Una vez más, el compañero presidente @lopezobrador_ hizo el favor de mencionarme en su mañanera como parte de su lista de personajes favoritos que asistieron ayer a la histórica convocatoria del zócalo. Está que revienta el coraje del señor», posteó',
    };

    const module = await import('../../controllers/summarizer_mentions.js');
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
