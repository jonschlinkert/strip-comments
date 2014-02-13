var reBlock = /\/\*(?:(?!\*\/)[\s\S])*\*\//g;
var reLine =  /\/\/[^\r\n?|\n]*/g;

/**
 * Strip all comments
 * @param   {String}  str
 * @return  {String}
 */

var strip = module.exports = function(str) {
  return str ? strip.block(strip.line(str)) : '';
};

/**
 * Strip block comments
 * @param   {String}  str
 * @return  {String}
 */

strip.block = function(str) {
  return str ? str.replace(reBlock, '') : '';
};

/**
 * Strip line comments
 * @param   {String}  str
 * @return  {String}
 */

strip.line = function(str) {
  return str ? str.replace(reLine, '') : '';
};
