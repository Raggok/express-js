import 'dotenv/config';

import { encode } from 'gpt-3-encoder';

export default class GTPEncoder {
  getTokens(text) {
    return encode(text).length;
  }
}
