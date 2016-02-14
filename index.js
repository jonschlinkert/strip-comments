/*!
 * strip-comments <https://github.com/jonschlinkert/strip-comments>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Released under the MIT license.
 */

'use strict';

var extend = require('extend-shallow');
var extract = require('extract-comments');

/**
 * Strip all code comments from the given `input`,
 * including these that are ignored.
 * Pass `opts.safe: true` to keep them.
 *
 * **Example**
 *
 * ```js
 * var str = strip('foo; // this is a comment\n /* me too *\/');
 * console.log(str);
 * // => 'foo; \n '
 * ```
 *
 * @name  strip
 * @param  {String} `<input>` string from which to strip comments
 * @param  {Object} `opts` optional options, passed to [extract-comments][extract-comments]
 *   @option {Boolean} [opts] `line` if `false` strip only block comments, default `true`
 *   @option {Boolean} [opts] `block` if `false` strip only line comments, default `true`
 *   @option {Boolean} [opts] `safe` pass `true` to keep ignored comments (e.g. `/*!` and `//!`)
 *   @option {Boolean} [opts] `preserveNewlines` if `true` preserve newlines after comments are stripped
 * @return {String} modified input
 * @api public
 */

exports = module.exports = function stripAllComments(input, opts) {
  opts = extend({block: true, line: true}, opts);
  return stripComments(input, opts);
};

/**
 * Strip only block comments.
 *
 * **Example**
 *
 * ```js
 * var output = strip('foo; // this is a comment\n /* me too *\/', { line: false });
 * console.log(output);
 * // => 'foo; // this is a comment\n '
 * ```
 *
 * **Example**
 *
 * ```js
 * var output = strip.block('foo; // this is a comment\n /* me too *\/');
 * console.log(output);
 * // => 'foo; // this is a comment\n '
 * ```
 *
 * @name  .block
 * @param  {String} `<input>` string from which to strip comments
 * @param  {Object} `[opts]` pass `opts.safe: true` to keep ignored comments (e.g. `/*!`)
 * @return {String} modified string
 * @api public
 */

exports.block = function stripBlockComments(input, opts) {
  opts = extend({block: true}, opts);
  return stripComments(input, opts);
};

/**
 * Strip only line comments.
 *
 * **Example**
 *
 * ```js
 * var output = strip('foo; // this is a comment\n /* me too *\/', { block: false });
 * console.log(output);
 * // => 'foo; \n /* me too *\/'
 * ```
 *
 * **Example**
 *
 * ```js
 * var output = strip.line('foo; // this is a comment\n /* me too *\/');
 * console.log(output);
 * // => 'foo; \n /* me too *\/'
 * ```
 *
 * @name  .line
 * @param  {String} `<input>` string from which to strip comments
 * @param  {Object} `[opts]` pass `opts.safe: true` to keep ignored comments (e.g. `//!`)
 * @return {String} modified string
 * @api public
 */

exports.line = function stripLineComments(input, opts) {
  opts = extend({line: true}, opts);
  return stripComments(input, opts);
};

/**
 * Strip the first comment from the given `input`.
 * If `opts.safe: true` is passed, will strip the first that is not ignored.
 *
 * **Example**
 *
 * ```js
 * var str = '//! first comment\nfoo; // this is a comment';
 * var output = strip(str, {
 *   first: true
 * });
 * console.log(output);
 * // => '\nfoo; // this is a comment'
 * ```
 *
 * **Example**
 *
 * ```js
 * var str = '//! first comment\nfoo; // this is a comment';
 * var output = strip.first(str, { safe: true });
 * console.log(output);
 * // => '//! first comment\nfoo; '
 * ```
 *
 * @name .first
 * @param {String} `<input>`
 * @param {Object} `[opts]` pass `opts.safe: true` to keep comments with `!`
 * @return {String}
 * @api public
 */

exports.first = function stripFirstComment(input, opts) {
  opts = extend({block: true, line: true, first: true}, opts);
  return stripComments(input, opts);
};

/**
 * Private function for stripping comments.
 *
 * @param  {String} `<input>`
 * @param  {Object} `[opts]`
 * @return {String}
 * @api private
 */
function stripComments(input, opts) {
  // strip all by default, including `ingored` comments.
  opts = extend({
    block: false,
    line: false,
    safe: false,
    first: false
  }, opts);

  // compatibility with `extract-comments`
  opts.keepProtected = opts.safe;

  var comments = extract(input, opts);
  var len = comments.length;
  var i = 0;

  while (i < len) {
    var comment = comments[i++];
    input = discard(input, comment, opts);
  }
  return input;
}

/**
 * Remove a comment from the given string.
 *
 * @param {String} `str`
 * @param {Object} `comment`
 * @param {Object} `opts`
 * @return {String}
 */

function discard(str, comment, opts) {
  var ch = comment.value.charAt(0);
  if (opts && opts.safe === true && ch === '!') {
    return str;
  }
  var nl = '';
  if (opts && opts.preserveNewlines) {
    nl = comment.raw.replace(/[^\r\n]/g, '');
  }
  if (comment.type === 'line') {
    str = str.replace('//' + comment.raw, nl);
  }
  if (comment.type === 'block') {
    str = str.replace('/*' + comment.raw + '*/', nl);
  }
  return str;
}
