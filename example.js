var fs = require('fs');
var strip = require('./');
var protect = require('protect-strings');

function read(fp) {
  return fs.readFileSync(fp, 'utf-8');
}

var fixture = read('test/fixtures/literals/comment-like.js');
var res = protect(fixture);

// console.log(res);