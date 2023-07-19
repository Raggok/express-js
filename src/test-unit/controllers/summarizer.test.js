/* eslint-disable no-undef */
import summarizer from '../../controllers/summarizer.js';

import Logs from '../../domain/logs/logs.js';
import OpenAI from '../../services/openAi.js';
import GTPEncoder from '../../services/gtp-3-encoder.js';
import { OPENAI_MODELS } from '../../types/types-models.js';

const text_request = [
  'Las estrellas son cuerpos celestes gigantes, compuestos principalmente por hidrógeno y helio,',
  'que producen luz y calor desde sus arremolinadas fundiciones nucleares.',
];
const tokens = 500;

jest.mock('../../utils/split-paragraphs.js', () => ({
  splitParagraphs: jest
    .fn()
    .mockReturnValue([text_request[0], text_request[1]]),
}));
jest.mock('../../utils/text-util.js', () => ({
  getPercentageTokens: jest.fn().mockReturnValue(tokens),
  getValue: jest.fn().mockReturnValue(1),
}));

jest.mock('../../services/openAi.js');
jest.mock('../../domain/logs/logs.js');
jest.mock('../../services/gtp-3-encoder.js');
describe('Controller Summarizer', () => {
  const date = '2020-05-13 12:33';
  Date.now = jest.fn(() => new Date(date));

  const controller = 'summarizer',
    model = 'davinci',
    response =
      'Las estrellas son cuerpos celestes gigantes, compuestos principalmente por hidrógeno y helio.',
    userId = '1dac46c4-1e6a-4591-826c-fac42ffa8e3b',
    company = 'EFINFO',
    extra = { digest: 'digest' },
    logId = 'logId';
  const user = { userId, company };
  const body = {
    model,
    controller,
    prompt: 'Realiza un resumen',
    text: 'Las estrellas son cuerpos celestes gigantes, compuestos principalmente por hidrógeno y helio, que producen luz y calor desde sus arremolinadas fundiciones nucleares.',
    extra,
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const use_model = OPENAI_MODELS[`GTP-3`][model];

  const req = {
    user,
    body,
  };

  describe('summarizer', () => {
    const data = {
        choices: [{ text: response }],
        usage: { total_tokens: 450 },
      },
      time = 5;

    test('should return the summary', async () => {
      Logs.prototype.add.mockReturnValue(logId);
      GTPEncoder.prototype.getTokens.mockReturnValue(tokens);
      OpenAI.prototype.completion.mockReturnValue({
        data,
        time,
      });

      const result = await summarizer(req);
      const text = `Realiza un resumen:\n${text_request[0]}`;
      expect(GTPEncoder.prototype.getTokens).toHaveBeenCalledTimes(1);
      expect(GTPEncoder.prototype.getTokens).toBeCalledWith(text);

      expect(OpenAI.prototype.completion).toHaveBeenCalledTimes(1);

      expect(Logs.prototype.add).toHaveBeenCalledTimes(1);
      expect(Logs.prototype.add).toBeCalledWith(
        controller,
        model,
        text,
        data.choices[0].text,
        date,
        (data.usage.total_tokens * use_model.cost) / 1000,
        time,
        user.id,
        JSON.stringify({ client: user.company, ...extra })
      );

      expect(result).toEqual({
        summary: data.choices[0].text,
        time,
        registerId: logId,
      });
    });

    test('should throw error if service openAi not response', async () => {
      Logs.prototype.add.mockReturnValue('');
      GTPEncoder.prototype.getTokens.mockReturnValue(tokens);
      OpenAI.prototype.completion.mockRejectedValue(
        new Error('service OpenAI: failed ')
      );

      const result = summarizer(req);
      await expect(result).rejects.toMatchInlineSnapshot(
        `[TypeError: Cannot read properties of undefined (reading '0')]`
      );
    });

    test('should throw error if model not exit', async () => {
      Logs.prototype.add.mockReturnValue('');
      GTPEncoder.prototype.getTokens.mockReturnValue(tokens);
      OpenAI.prototype.completion.mockReturnValue({
        data,
        time,
      });
      req.body.model = 'modelo';

      const result = summarizer(req);
      await expect(result).rejects.toMatchInlineSnapshot(
        `[Error: el modelo no existe]`
      );
    });
  });
});
