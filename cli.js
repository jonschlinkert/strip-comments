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
	.option('-o, --output <file>', 'output file')
	.option('-s, --strip [type]', 'strip method; available values are "all", "block" and "line"', 'all');

program.parse(process.argv);

if ( program.output && program.args[0] ) {
	fs.writeFileSync(program.output, resolveStrip(program.strip)(fs.readFileSync(program.args[0], 'utf8')), 'utf8');
}
