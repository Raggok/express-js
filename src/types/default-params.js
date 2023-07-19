const OPENAI_PARAMS = {
  summarizer: {
    model: 'davinci',
    prompt: 'Realiza un resumen de tres lineas',
    temperature: 0.9,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  },
  summarizer_mentions: {
    model: 'davinci',
    prompt:
      'Realiza un resumen del siguiente texto que contenga las siguientes palabras',
    temperature: 0.9,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  },
  correction: {
    model: 'davinci',
    prompt: 'Corrige la ortografía del siguiente texto',
    temperature: 0,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  },
};

export { OPENAI_PARAMS };
