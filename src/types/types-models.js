const OPENAI_MODELS = {
  'GTP-3': {
    davinci: { name: 'text-davinci-002', max_tokens: 4000, cost: 0.02 },
    curie: { name: 'text-curie-001', max_tokens: 2048, cost: 0.002 },
    babbage: { name: 'text-babbage-001', max_tokens: 2048, cost: 0.0005 },
    ada: { name: 'text-ada-001', max_tokens: 2048, cost: 0.0004 },
  },
};

export { OPENAI_MODELS };
