/**
 * strip-comments <https://github.com/jonschlinkert/strip-comments>
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */


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
  return str ? str.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\//g, '') : '';
};

/**
 * Strip line comments
 * @param   {String}  str
 * @return  {String}
 */

strip.line = function(str) {
  return str ? str.replace(/\/\/[^\n|\r]*/g, '') : '';
};