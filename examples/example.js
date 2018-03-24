'use strict';

var fs = require('fs');
var strip = require('./');

var all = fs.readFileSync('test/fixtures/strip-all.js', 'utf8');
var str = fs.readFileSync('test/fixtures/banner.js', 'utf8');

// console.log(strip.first(all))
// console.log(strip.block(all));
// console.log(strip.line(all));
console.log(strip(all));
