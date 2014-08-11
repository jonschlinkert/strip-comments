/*!
 * strip-comments <https://github.com/jonschlinkert/strip-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use stric';

var reBlock = '\\/\\*';
var reBlockIgnore = '\\/\\*(?!\\*?\\!)';
var reBlockEnd = '(.|[\\r\\n]|\\n)*?\\*\\/\\n?\\n?';
var reLine =  '(\\/\\/.*)';
var reLineIgnore =  '(\\/\\/(?!\\!).*)';

/**
 * ### strip(str[, opts])
 *
 * Strip all comments
 *
 * @param   {String}  `str`  file contents or string to strip.
 * @param   {Object}  `opts`  options are passed to `.block`, and `.line`
 * @return  {String}
 * @api public
 */

var strip = module.exports = function(str, opts) {
  return str ? strip.block(strip.line(str, opts), opts) : '';
};

/**
 * ### strip.block(str[, opts])
 *
 * Strip only block comments
 *
 * @param   {String}  `str`  file content or string to strip to
 * @param   {Object}  `opts`  if `safe:true`, strip only that not starts with `/*!` or `/**!`
 * @return  {String}
 * @api public
 */

strip.block = function(str, opts) {
  opts = opts || {};
  var re = new RegExp(reBlock + reBlockEnd, 'gm');
  if(opts.safe) {
    re = new RegExp(reBlockIgnore + reBlockEnd, 'gm');
  }
  return str ? str.replace(re, '') : '';
};

/**
 * ### strip.line(str[, opts])
 *
 * Strip only line comments
 *
 * @param   {String}  `str`  file content or string to strip to
 * @param   {Object}  `opts`  if `safe:true`, strip all that not starts with `//!`
 * @return  {String}
 * @api public
 */

strip.line = function(str, opts) {
  opts = opts || {};
  var re = new RegExp(reLine, 'gm');
  if(opts.safe) {
    re = new RegExp(reLineIgnore, 'gm');
  }
  return str ? str.replace(re, '') : '';
};
