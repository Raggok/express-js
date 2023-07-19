import moment from 'moment';

import OpenAI from '../services/openAi.js';
import GTPEncoder from '../services/gtp-3-encoder.js';

import Logs from '../domain/logs/logs.js';
import { OPENAI_MODELS } from '../types/types-models.js';
import { OPENAI_PARAMS } from '../types/default-params.js';
import { splitParagraphs } from '../utils/split-paragraphs.js';
import { getPercentageTokens, getValue } from '../utils/text-util.js';

const keyCorrection = process.env.KEY_OPENAI_CORRECTION;
const openAi = new OpenAI(keyCorrection);
const logs = new Logs();
const gtpEncoder = new GTPEncoder();

export default async (req) => {
  const user = req.user;
  const {
    controller,
    model,
    prompt,
    text,
    temperature,
    top_p,
    frequency_penalty,
    presence_penalty,
    extra,
  } = req.body;

  let params = OPENAI_PARAMS[controller];
  if (!params) throw new Error(`el controlador no existe`);
  if (!text) throw new Error(`no se recibió ningun texto`);

  const use_model = OPENAI_MODELS[`GTP-3`][model ? model : params.model];
  if (!use_model) throw new Error(`el modelo no existe`);

  const max_tokens = getPercentageTokens(use_model.max_tokens, 40);
  let prompToUse = (prompt ? prompt : params.prompt) + ':\n';

  let startTime = performance.now();
  const text_split = splitParagraphs(prompToUse, text, max_tokens, '.');

  params = {
    ...params,
    model: use_model.name,
    prompt: prompToUse,
    temperature: getValue(temperature, params.temperature),
    top_p: getValue(top_p, params.top_p),
    frequency_penalty: getValue(frequency_penalty, params.frequency_penalty),
    presence_penalty: getValue(presence_penalty, params.presence_penalty),
    max_tokens: use_model.max_tokens - max_tokens,
  };

  openAi.setParams(params);
  let total_usage_tokens = 0;
  let total_prompts = [];
  const correctionPromises = text_split.map(async (text) => {
    const text_prompt = prompToUse + text;
    const max_tokens_text = gtpEncoder.getTokens(text_prompt);
    openAi.setPrompt(text_prompt);
    openAi.setMaxToken(use_model.max_tokens - max_tokens_text);
    total_prompts.push(text_prompt);
    return await openAi.completion();
  });

  // eslint-disable-next-line no-undef
  const response = await Promise.all(correctionPromises);
  const data = response.map((item) => {
    total_usage_tokens += item.data.usage.total_tokens;
    return item.data.choices[0].text;
  });
  let endTime = performance.now();
  let time = endTime - startTime;
  time = (time / 1000).toFixed(2);

  const registerId = await logs.add(
    controller,
    model,
    total_prompts.join('|'),
    data.join('|'),
    moment().format('YYYY-MM-DD HH:mm'),
    (total_usage_tokens * use_model.cost) / 1000,
    time,
    user.id,
    JSON.stringify({ client: user.company, ...extra })
  );

  return { correction: data.join(' '), time, registerId };
};
