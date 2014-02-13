/**
 * strip-comments <https://github.com/jonschlinkert/strip-comments>
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

var reBlock = '\\/\\*(?:(?!\\*\\/)[\\s\\S])*\\*\\/';
var reLine =  '^\\/\\/[^\\r\\n?|\\n]*';


/**
 * Strip all comments
 * @param   {String}  str
 * @return  {String}
 */

var strip = module.exports = function(str) {
  return str ? strip.block(strip.line(str)) : '';
};


/**
 * Strip banners
 *
 * @param   {String}  str
 * @return  {String}
 */

strip.banner = function(str, opts) {
  opts = opts || {};
  var re = new RegExp('^' + reBlock + '\\s+', 'g');
  if(opts.safe) {
    re = new RegExp('^[^\\/\*\*?\!]' + reBlock + '\\s+', 'g');
  }
  return str ? str.replace(re, '') : '';
};


/**
 * Strip block comments except
 * for banner
 *
 * @param   {String}  str
 * @return  {String}
 */

strip.safeBlock = function(str) {
  var re = new RegExp('[^\\/\*\*?\!]' + reBlock + '\\n', 'gm');
  return str ? str.replace(re, '') : '';
};


/**
 * Strip block comments
 *
 * @param   {String}  str
 * @return  {String}
 */

strip.block = function(str) {
  var re = new RegExp(reBlock, 'g');
  return str ? str.replace(re, '') : '';
};


/**
 * Strip line comments
 *
 * @param   {String}  str
 * @return  {String}
 */

strip.line = function(str) {
  var re = new RegExp(reLine, 'gm');
  return str ? str.replace(re, '') : '';
};
