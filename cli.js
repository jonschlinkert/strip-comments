#!/usr/bin/env node

var pkg = require('./package.json');
var fs = require('fs');
var program = require('commander');
var strip = require('./index.js');

function resolveStrip ( type ) {
  return strip[type] ? strip[type] : strip;
}

program
  .version(pkg.version)
  .option('-i, --input <file>', 'input file')
  .option('-o, --output <file>', 'output file')
  .option('-s, --strip [type]', 'strip method; available values are "all", "block" and "line"', 'all');

program.parse(process.argv);

if ( program.output && program.input) {
  fs.writeFileSync(program.output, resolveStrip(program.strip)(fs.readFileSync(program.input, 'utf8')), 'utf8');
}
