'use strict';

var extract = require('extract-comments');
var bom = require('strip-bom-string');

function block(str, options) {
  return stripEach(str, extract.block(str), options);
}

function line(str, options) {
  return stripEach(str, extract.line(str), options);
}

function stripEach(str, comments, options) {
  comments.forEach(function (comment) {
    str = discard(str, comment, options);
  });
  return str;
}
function start(comment) {
  return comment.loc.start.pos;
}
function end(comment) {
  return comment.loc.end.pos;
}

function discard(str, comment, options) {
  options = options || {};
  var ch = comment.value.charAt(0);
  if (ch === '!' && options.safe === true) {
    return str;
  }
  return str.split(comment.raw).join('');
}

function strip(str, options) {
  return block(line(str, options), options);
}

module.exports = strip;
module.exports.block = block;
// module.exports.first = first;
module.exports.line = line;