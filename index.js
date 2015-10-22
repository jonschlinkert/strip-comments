/*!
 * strip-comments <https://github.com/jonschlinkert/strip-comments>
 *
 * Copyright (c) 2014-2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var reBlock = /\/\*(?!\/)(.|[\r\n]|\n)+?\*\/\n?\n?/gm;
var reBlockIgnore = /\/\*(?!(\*?\/|\*?\!))(.|[\r\n]|\n)+?\*\/\n?\n?/gm;
var reLine = /(^|[^\S\n])(?:\/\/)([\s\S]+?)$/gm;
var reLineIgnore = /(^|[^\S\n])(?:\/\/[^!])([\s\S]+?)$/gm;

/**
 * Strip all comments
 *
 * @param   {String} `str`  file contents or string to strip.
 * @param   {Object} `opts`  options are passed to `.block`, and `.line`
 * @return  {String} String without comments.
 * @api public
 */

function strip(str, opts) {
  return str ? strip.block(strip.line(str, opts), opts) : '';
}

/**
 * Strip only block comments, optionally leaving protected comments
 * (e.g. `/*!`) intact.
 *
 * @param   {String} `str`  file content or string to strip to
 * @param   {Object} `opts`  if `safe:true`, strip only comments that do not start with `/*!` or `/**!`
 * @return  {String} String without block comments.
 * @api public
 */

strip.block = function(str, opts) {
  opts = opts || {};
  var re = reBlock; //new RegExp(reBlock + reBlockEnd, 'gm');
  if(opts.safe) {
    re = reBlockIgnore; //new RegExp(reBlockIgnore + reBlockEnd, 'gm');
  }
  return str ? str.replace(re, '') : '';
};


/**
 * Strip only line comments
 *
 * @param   {String} `str`  file content or string to strip to
 * @param   {Object} `opts`  if `safe:true`, strip all that not starts with `//!`
 * @return  {String} String without line comments.
 * @api public
 */

strip.line = function(str, opts) {
  opts = opts || {};
  var re = reLine;
  if(opts.safe) {
    re = reLineIgnore;
  }
  return str ? str.replace(re, '') : '';
};

/**
 * Expose `strip`
 */

module.exports = strip;