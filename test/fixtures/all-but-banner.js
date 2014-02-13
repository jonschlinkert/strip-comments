/*!
 * strip-comments <https://github.com/jonschlinkert/strip-comments>
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

// this is a line
var reBlock = /\/\*(?:(?!\*\/)[\s\S])*\*\//g;
// this is a line
var reLine =  /\/\/[^\r\n?|\n]*/g;

/**
 * Strip all comments
 * @param   {String}  str
 * @return  {String}
 */

// this is a line
var strip = module.exports = function(str) {
  return str ? strip.block(strip.line(str)) : '';
};

/**
 * Strip block comments
 * @param   {String}  str
 * @return  {String}
 */

// this is a line
strip.block = function(str) {
  return str ? str.replace(reBlock, '') : '';
};

/**
 * Strip line comments
 * @param   {String}  str
 * @return  {String}
 */

// this is a line
strip.line = function(str) {
  return str ? str.replace(reLine, '') : '';
};
