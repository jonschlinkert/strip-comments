'use stric';

var fs = require('fs');
var strip = require('../index')

function read(src) {
  var str = fs.readFileSync('./' + src,'utf-8');
  return str;
}

describe('strip all or empty:', function () {
  it('should not throw an error at an empty string.', function () {
    var actual = strip();
    var expected = '';
    actual.should.eql(expected);
  });
  it('should strip all multiline, singleline, block and line comments.', function () {
    var fixture = read('test/fixtures/strip-all.js');
    var actual = strip(fixture);
    var expected = read('test/expected/strip-all.js');
    actual.should.eql(expected);
  });
  it('should strip only all block comments that not starts with `/*!` or `/**!` (safe:true).', function () {
    var fixture = read('test/fixtures/strip-all.js');
    var actual = strip.block(fixture, {safe:true});
    var expected = read('test/expected/strip-keep-block.js');
    actual.should.eql(expected);
  });
  it('should strip only all line comments that not starts with `//!` (safe:true).', function () {
    var fixture = read('test/fixtures/strip-keep-line.js');
    var actual = strip.line(fixture, {safe:true});
    var expected = read('test/expected/strip-keep-line.js');
    actual.should.eql(expected);
  });
});

describe('block comments:', function () {
  it('should strip block comments from a function.', function () {
    var actual = strip.block('var bar = function(/* this is a comment*/) {return;};');
    var expected = 'var bar = function() {return;};';
    actual.should.eql(expected);
  });

  it('should strip block comments before and from a function.', function () {
    var actual = strip.block('/* this is a comment */\nvar bar = function(/*this is a comment*/) {return;};');
    var expected = 'var bar = function() {return;};';
    actual.should.eql(expected);
  });

  it('should strip block comments before, after and from a function.', function () {
    var actual = strip.block('/* this is a comment */var bar = function(/*this is a comment*/) {return;};\n/* this is a comment*/');
    var expected = 'var bar = function() {return;};\n';
    actual.should.eql(expected);
  });
});

describe('line comments:', function () {
  it('should strip line comments.', function () {
    var actual = strip.line('// this is a line comment\nvar bar = function(/*this is a comment*/) {return;};');
    var expected = '\nvar bar = function(/*this is a comment*/) {return;};';
    actual.should.eql(expected);
  });

  it('should strip line comments before a function, and not block comments.', function () {
    var actual = strip.line('/* this is a comment */\n//this is a comment\nvar bar = function(/*this is a comment*/) {return;};');
    var expected = '/* this is a comment */\n\nvar bar = function(/*this is a comment*/) {return;};';
    actual.should.eql(expected);
  });

  it('should strip line comments before and after a function, and not block comments.', function () {
    var actual = strip.line('/* this is a comment */\n//this is a comment\nvar bar = function(/*this is a comment*/) {return;};\n//this is a line comment');
    var expected = '/* this is a comment */\n\nvar bar = function(/*this is a comment*/) {return;};\n';
    actual.should.eql(expected);
  });
});