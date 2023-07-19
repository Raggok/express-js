import GTPEncoder from '../services/gtp-3-encoder.js';
import { searchKeyword } from './text-util.js';

const gtpEncoder = new GTPEncoder();

export function splitParagraphs(
  prompt,
  text,
  max_tokens,
  separator = '\n',
  mentions
) {
  let paraghaphs = [];
  if (gtpEncoder.getTokens(prompt + text) > max_tokens) {
    if (mentions?.length > 0) {
      paraghaphs = getParagraphsMentions(
        prompt,
        text,
        max_tokens,
        separator,
        mentions
      );
    } else {
      paraghaphs = getParagraphs(prompt, text, max_tokens, separator);
    }
  } else {
    paraghaphs.push(text);
  }

  return paraghaphs;
}

function getParagraphs(prompt, text, max_tokens, separator) {
  const paragraphs = text.split(separator);
  let short_text = '',
    tokens_text = [],
    concatenated = '',
    cuts_text = [];

  paragraphs.forEach((paragraph, indice, arr) => {
    concatenated += `${paragraph} ${separator}`;
    tokens_text = gtpEncoder.getTokens(prompt + concatenated);
    if (tokens_text <= max_tokens && indice !== arr.length - 1) {
      short_text += `${paragraph} ${separator}`;
    } else {
      if (indice === arr.length - 1) {
        short_text += `${paragraph} ${separator}`;
      }
      cuts_text.push(short_text);
      short_text = `${paragraph} ${separator}`;
      concatenated = `${paragraph} ${separator}`;
    }
  });
  return cuts_text;
}

function getParagraphsMentions(prompt, text, max_tokens, separator, mentions) {
  const paragraphs = text.split(separator);
  let paragraphsWmentions = [];
  let cuts_text = [];
  paragraphs.forEach((paragraph, indice) => {
    if (searchMention(mentions, paragraph) || indice === 0) {
      //if exist mention or is the first paragraph
      paragraphsWmentions.push(paragraph);
    }
  });

  cuts_text = getParagraphs(
    prompt,
    paragraphsWmentions.join(separator),
    max_tokens,
    separator
  );
  return cuts_text;
}

function searchMention(mentions, paragraph) {
  let exist = false;
  mentions.forEach((mention) => {
    const result_exist = searchKeyword(paragraph, mention);
    if (result_exist) {
      exist = true;
    }
  });
  return exist;
}
