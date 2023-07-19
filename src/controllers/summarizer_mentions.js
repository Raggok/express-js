import moment from 'moment';
import OpenAI from '../services/openAi.js';
import GTPEncoder from '../services/gtp-3-encoder.js';

import Logs from '../domain/logs/logs.js';
import redundancyService from './summarizer_cohere.js';

import { OPENAI_MODELS } from '../types/types-models.js';
import { OPENAI_PARAMS } from '../types/default-params.js';
import { splitParagraphs } from '../utils/split-paragraphs.js';
import {
  getMentionsText,
  getPercentageTokens,
  getValue,
} from '../utils/text-util.js';

const keySummarizer = process.env.KEY_OPENAI_SUMMARIZER;
const openAi = new OpenAI(keySummarizer);
const logs = new Logs();
const gtpEncoder = new GTPEncoder();

export default async (req) => {
  const user = req.user;
  let {
    controller,
    model,
    prompt,
    text,
    temperature,
    top_p,
    mentions,
    frequency_penalty,
    presence_penalty,
    extra,
  } = req.body;

  let params = OPENAI_PARAMS[controller];

  if (!params) throw new Error(`el controlador no existe`);
  if (!text) throw new Error(`no se recibió ningun texto`);
  if (!mentions) throw new Error(`especifica las menciones`);

  const use_model = OPENAI_MODELS[`GTP-3`][model ? model : params.model];
  if (!use_model) throw new Error(`el modelo no existe`);

  const max_tokens = getPercentageTokens(use_model.max_tokens, 70);

  const found_mentions = getMentionsText(text, mentions);

  let prompToUse = prompt ? prompt : params.prompt;

  if (found_mentions.length === 0) {
    prompToUse = 'realiza un resumen de tres lineas del siguiente texto:\n';
  } else {
    prompToUse = `${prompToUse} ${found_mentions.toString()}:\n`;
  }

  const text_split = splitParagraphs(
    prompToUse,
    text,
    max_tokens,
    '\n',
    found_mentions
  );

  const text_prompt = prompToUse + text_split[0];
  const max_tokens_text = gtpEncoder.getTokens(text_prompt);

  params = {
    ...params,
    model: use_model.name,
    prompt: text_prompt,
    temperature: getValue(temperature, params.temperature),
    top_p: getValue(top_p, params.top_p),
    frequency_penalty: getValue(frequency_penalty, params.frequency_penalty),
    presence_penalty: getValue(presence_penalty, params.presence_penalty),
    max_tokens: use_model.max_tokens - max_tokens_text,
  };

  openAi.setParams(params);
  try {
    const { data, time } = await openAi.completion();

    const registerId = await logs.add(
      controller,
      model,
      text_prompt,
      data.choices[0].text,
      moment().format('YYYY-MM-DD HH:mm'),
      (data.usage.total_tokens * use_model.cost) / 1000,
      time,
      user.id,
      JSON.stringify({ client: user.company, ...extra })
    );

    return { summary: data.choices[0].text, time, registerId };
  } catch (error) {
    if (error.code === 500 || error.code === 429) {
      return await redundancyService(req);
    } else {
      throw new Error(`Summarizer ${error.message}`);
    }
  }
};
