function getMentionsText(text, mentions) {
  let found_mentions = [];

  mentions?.forEach(function (mention) {
    const exist = searchKeyword(text, mention);
    if (exist) {
      found_mentions.push(mention);
    }
  });

  return found_mentions;
}

function searchKeyword(text, keyword) {
  let position = -1;
  const expReg = new RegExp(
    `\\b${keyword
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')}\\b`,
    'gi'
  );

  position = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .search(new RegExp(expReg));

  if (position != -1) {
    return true;
  }

  return false;
}
function getPercentageTokens(max_tokens, percentage) {
  return (percentage / 100) * max_tokens;
}

function getValue(value, value2) {
  return value ? value : value2;
}

export { getMentionsText, searchKeyword, getPercentageTokens, getValue };
