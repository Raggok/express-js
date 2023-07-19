/* eslint-disable no-undef */
import correction from '../../controllers/correction.js';
import OpenAI from '../../services/openAi.js';
import GTPEncoder from '../../services/gtp-3-encoder.js';
import Logs from '../../domain/logs/logs.js';
import { splitParagraphs } from '../../utils/split-paragraphs.js';
import { getPercentageTokens } from '../../utils/text-util.js';

jest.mock('../../services/openAi.js');
jest.mock('../../services/gtp-3-encoder.js');

jest.mock('../../domain/logs/logs.js');

jest.mock('../../utils/split-paragraphs.js', () => {
  return {
    splitParagraphs: jest
      .fn()
      .mockReturnValue(['Paragraph 1.', 'Paragraph 2.']),
  };
});

jest.mock('../../utils/text-util.js', () => {
  return {
    getPercentageTokens: jest.fn().mockReturnValue(60),
    getValue: jest.fn().mockReturnValue(0.8),
  };
});
let extra = { digest: 'digest' };
const logId = 'logId';
const req = {
  user: {
    id: '1dac46c4-1e6a-4591-826c-fac42ffa8e3b',
    company: 'EFINFO',
  },
  body: {
    controller: 'correction',
    model: 'davinci',
    prompt: 'Prompt',
    text: 'Text',
    temperature: 0.5,
    top_p: 0.7,
    frequency_penalty: 0.8,
    presence_penalty: 0.9,
    extra,
  },
};

afterEach(() => {});

describe('correction', () => {
  const date = '2023-05-16 10:30';
  Date.now = jest.fn(() => new Date(date));
  Object.defineProperty(performance, 'now', {
    value: jest.fn().mockReturnValue(1234567890),
  });
});

test('should return the correction', async () => {
  Logs.prototype.add.mockReturnValue(logId);
  OpenAI.prototype.setParams.mockReturnValue('');
  OpenAI.prototype.setPrompt.mockReturnValue('');
  OpenAI.prototype.setMaxToken.mockReturnValue('');
  OpenAI.prototype.completion.mockReturnValue({
    data: {
      choices: [
        {
          text: 'Corrected text',
        },
      ],
      usage: {
        total_tokens: 100,
      },
    },
  });

  GTPEncoder.prototype.getTokens.mockReturnValue(50);

  const result = await correction(req);
  expect(GTPEncoder).toHaveBeenCalledTimes(1);
  expect(Logs).toHaveBeenCalledTimes(1);
  expect(getPercentageTokens).toHaveBeenCalledTimes(1);
  expect(splitParagraphs).toHaveBeenCalledWith('Prompt:\n', 'Text', 60, '.');
  expect(OpenAI.prototype.setParams).toHaveBeenCalledTimes(1);
  expect(OpenAI.prototype.setPrompt).toHaveBeenCalledTimes(2);
  expect(OpenAI.prototype.setMaxToken).toHaveBeenCalledTimes(2);
  expect(GTPEncoder.prototype.getTokens).toHaveBeenCalledTimes(2);
  expect(GTPEncoder.prototype.getTokens).toHaveBeenNthCalledWith(
    1,
    'Prompt:\nParagraph 1.'
  );
  expect(GTPEncoder.prototype.getTokens).toHaveBeenNthCalledWith(
    2,
    'Prompt:\nParagraph 2.'
  );

  expect(Logs.prototype.add).toHaveBeenCalledWith(
    'correction',
    'davinci',
    'Prompt:\nParagraph 1.|Prompt:\nParagraph 2.',
    'Corrected text|Corrected text',
    '2023-05-16 10:30',
    0.004,
    '0.00',
    '1dac46c4-1e6a-4591-826c-fac42ffa8e3b',
    JSON.stringify({ client: 'EFINFO', ...extra })
  );
  expect(result).toEqual({
    correction: 'Corrected text Corrected text',
    time: '0.00',
    registerId: logId,
  });
});

test('should return the correction with default params', async () => {
  Logs.prototype.add.mockReturnValue(logId);
  OpenAI.prototype.setParams.mockReturnValue('');
  OpenAI.prototype.setPrompt.mockReturnValue('');
  OpenAI.prototype.setMaxToken.mockReturnValue('');
  OpenAI.prototype.completion.mockReturnValue({
    data: {
      choices: [
        {
          text: 'Corrected text',
        },
      ],
      usage: {
        total_tokens: 100,
      },
    },
  });

  GTPEncoder.prototype.getTokens.mockReturnValue(50);

  const result = await correction({
    ...req,
    body: {
      controller: 'correction',
      model: 'davinci',
      prompt: 'Prompt',
      text: 'Text',
    },
  });
  expect(result).toEqual({
    correction: 'Corrected text Corrected text',
    time: '0.00',
    registerId: logId,
  });
});

test('should throw error if service openAi not response', async () => {
  Logs.prototype.add.mockReturnValue('');
  GTPEncoder.prototype.getTokens.mockReturnValue(50);
  OpenAI.prototype.completion.mockRejectedValue(
    new Error('service OpenAI: failed ')
  );

  const result = correction(req);
  await expect(result).rejects.toMatchInlineSnapshot(
    `[Error: service OpenAI: failed ]`
  );
});

test('should throw error if model not exist', async () => {
  Logs.prototype.add.mockReturnValue('');
  GTPEncoder.prototype.getTokens.mockReturnValue(50);

  const result = correction({ ...req, body: { model: 'modelo' } });
  await expect(result).rejects.toMatchInlineSnapshot(
    `[Error: el controlador no existe]`
  );
});
