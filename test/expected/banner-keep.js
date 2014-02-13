/*!
 * strip-comments <https://github.com/jonschlinkert/strip-comments>
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

var reBlock = /\/\*(?:(?!\*\/)[\s\S])*\*\//g;
var reLine =  /\/\/[^\r\n?|\n]*/g;

var strip = module.exports = function(str) {
  return str ? strip.block(strip.line(str)) : '';
};

strip.block = function(str) {
  return str ? str.replace(reBlock, '') : '';
};

strip.line = function(str) {
  return str ? str.replace(reLine, '') : '';
};
