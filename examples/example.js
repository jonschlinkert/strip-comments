'use strict';

const fs = require('fs');
const strip = require('..');

const all = fs.readFileSync('test/fixtures/strip-all.js', 'utf8');
const str = fs.readFileSync('test/fixtures/banner.js', 'utf8');

// console.log(strip.first(all))
// console.log(strip.block(all));
// console.log(strip.line(all));
console.log(strip(all));
