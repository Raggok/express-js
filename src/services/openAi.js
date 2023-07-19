import { Configuration, OpenAIApi } from 'openai';

export default class OpenAI {
  constructor(key) {
    const configuration = new Configuration({
      apiKey: key || process.env.KEY_OPENAI,
    });
    this.openai = new OpenAIApi(configuration);
  }

  setParams(params) {
    this.model = params.model;
    this.prompt = params.prompt;
    this.temperature = params.temperature;
    this.max_tokens = params.max_tokens;
    this.top_p = params.top_p;
    this.frequency_penalty = params.frequency_penalty;
    this.presence_penalty = params.presence_penalty;
  }

  setPrompt(prompt) {
    this.prompt = prompt;
  }

  setMaxToken(max_tokens) {
    this.max_tokens = max_tokens;
  }

  async completion() {
    try {
      const startTime = Date.now();

      const { data } = await this.openai.createCompletion({
        model: this.model,
        prompt: this.prompt,
        temperature: this.temperature,
        max_tokens: this.max_tokens,
        top_p: this.top_p,
        frequency_penalty: this.frequency_penalty,
        presence_penalty: this.presence_penalty,
      });

      const endTime = Date.now();

      return { data, time: ((endTime - startTime) / 1000).toFixed(2) };
    } catch (error) {
      const errorResponse = new Error(`Service OpenAI: ${error.message}`);
      errorResponse.code = error.response.status;
      throw errorResponse;
    }
  }
}
