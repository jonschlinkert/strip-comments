const languages = require('../../lib/languages');

exports.strip = str => str.split('*\\/').join('*/');

// this is used by the readme template to generate the list of languages.
exports.languages = () => {
  const omit = new Set(['js', 'ts']);
  const keys = Object.keys(languages)
    .sort((a, b) => a.localeCompare(b))
    .filter(key => !omit.has(key));

  return `\n- ${keys.join('\n- ')}`;
};
