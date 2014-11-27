/*!
 * strip-comments <https://github.com/jonschlinkert/strip-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var extract = require('esprima-extract-comments');
var extend = require('extend-shallow');

/**
 * Expose `strip`
 */

module.exports = strip;

/**
 * Strip both block and line comments from the given `str`.
 *
 * ```js
 * strip('abc // foo bar baz\n/* quux fez *\/');
 * //=> 'abc '
 * ```
 *
 * @param {String} `str`
 * @param {Object} `opts` When `safe: true` comments with `//!` or `/*!` are preserved
 * @return {String} String without block comments.
 * @api public
 */

function strip(str, options) {
  if (!str || str.length === 0) {
    return '';
  }

  try {
    var opts = extend({safe: false}, options);
    var comments = extract.fromString(str);
    var keys = Object.keys(comments);
    var len = keys.length;
    var i = 0;
    while (i < len) {
      var key = keys[i++];
      var comment = comments[key];

      if (comment.type === 'Line') {
        comment.value = '//' + comment.value;
      }
      if (comment.type === 'Block') {
        comment.value = '/*' + comment.value + '*/';
      }
      str = str.replace(comment.value, '');
    }
  } catch(err) {
    if (opts.silent) return;
    throw err;
  }
  return str;
};

/**
 * Strip block comments from the given `str`.
 *
 * ```js
 * strip.block('abc // foo bar baz\n/* quux fez *\/');
 * //=> 'abc '
 * ```
 *
 * @param {String} `str`
 * @param {Object} `opts` When `safe: true` comments with `/*!` are preserved
 * @return {String}
 * @api public
 */

strip.block = function stripBlock(str, options) {
  var opts = extend({safe: false}, options);
  var comments = extract.fromString(str);
  var keys = Object.keys(comments);
  var len = keys.length;
  var i = 0;

  try {
    while (i < len) {
      var key = keys[i++];
      var comment = comments[key];

      if (comment.type === 'Block') {
        if (opts.safe === true && comment.value[0] === '!') {
          continue;
        } else {
          comment.value = '/*' + comment.value + '*/';
        }
        str = str.replace(comment.value, '');
      }

      if (comment.type === 'Line') {
        comment.value = '//' + comment.value;
      }
    }
  } catch(err) {
    if (opts.silent) return;
    throw err;
  }
  return str;
};

/**
 * Strip line comments from the given `str`.
 *
 * ```js
 * strip.line('abc // foo bar baz\n/* quux fez *\/');
 * //=> 'abc \n/* quux fez *\/'
 * ```
 *
 * @param {String} `str`
 * @param {Object} `opts` When `safe: true` comments with `//!` are preserved
 * @return {String}
 * @api public
 */

strip.line = function stripLine(str, options) {
  var opts = extend({safe: false}, options);
  var comments = extract.fromString(str);
  var keys = Object.keys(comments);
  var len = keys.length;
  var i = 0;

  try {
    while (i < len) {
      var key = keys[i++];
      var comment = comments[key];

      if (comment.type === 'Line') {
        if (opts.safe === true && comment.value[0] === '!') {
          continue;
        } else {
          comment.value = '//' + comment.value;
        }
        str = str.replace(comment.value, '');
      }

      if (comment.type === 'Block') {
        comment.value = '/*' + comment.value + '*/';
      }
    }
  } catch(err) {
    if (opts.silent) return;
    throw err;
  }
  return str;
};
