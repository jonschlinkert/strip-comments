'use strict';

var fs = require('fs');
var strip = require('../index');
require('should');
require('mocha');

function read(src) {
  var str = fs.readFileSync('./' + src,'utf-8');
  return str;
}
function normalize(str) {
  return str.replace(/[\n\r\s]+/g, '');
}

describe('strip:', function () {
  it('should strip all comments.', function () {
    var actual = strip("foo // this is a comment\n/* me too */")
    var expected = 'foo';
    normalize(actual).should.eql(normalize(expected));
  });

  it('should strip line comments.', function () {
    var actual = strip.line("foo // this is a comment\n/* me too */")
    var expected = 'foo\n/* me too */';
    normalize(actual).should.eql(normalize(expected));
  });

  it('should strip block comments.', function () {
    var actual = strip.block("foo // this is a comment\n/* me too */")
    var expected = 'foo // this is a comment\n';
    normalize(actual).should.eql(normalize(expected));
  });

  it('should strip all but not `/*/`', function() {
    var actual = strip("/* I will be stripped */\nvar path = '/and/this/*/not/be/stripped';")
    var expected = "\nvar path = '/and/this/*/not/be/stripped';"
    normalize(actual).should.eql(normalize(expected));
  })

  it('should strip all but not globstars `/**/*` #1', function() {
    var actual = strip("var path = './path/to/scripts/**/*.js';")
    var expected = "var path = './path/to/scripts/**/*.js';"
    normalize(actual).should.eql(normalize(expected));
  })

  it('should strip all but not globstars `/**/` #2 and `//!` line comments (safe:true)', function() {
    var actual = strip("var partPath = './path/*/to/scripts/**/'; //! line comment", {safe:true})
    var expected = "var partPath = './path/*/to/scripts/**/'; //! line comment"
    normalize(actual).should.eql(normalize(expected));
  })

  it('should strip all but not `/*/*something` from anywhere', function() {
    var actual = strip("var partPath = './path/*/*something/test.txt';")
    var expected = "var partPath = './path/*/*something/test.txt';"
    normalize(actual).should.eql(normalize(expected));
  })

  it('should strip all but not `/*/*something/*.js` from anywhere (globstar-like)', function() {
    var actual = strip("var partPath = './path/*/*something/*.js';")
    var expected = "var partPath = './path/*/*something/*.js';"
    normalize(actual).should.eql(normalize(expected));
  })

  it('should leave alone code without any comments', function() {
    var fixture = read('test/fixtures/no-comment.js');
    var actual = strip(fixture);
    var expected = fixture;
    actual.should.eql(expected);
  })
});

describe('strip all or empty:', function () {
  it('should not throw an error at an empty string.', function () {
    var actual = strip();
    var expected = '';
    normalize(actual).should.eql(normalize(expected));
  });
  it('should strip all multiline, singleline, block and line comments.', function () {
    var fixture = read('test/fixtures/strip-all.js');
    var actual = strip(fixture);
    var expected = read('test/expected/strip-all.js');
    normalize(actual).should.eql(normalize(expected));
  });
  it('should strip only all block comments that not starts with `/*!` or `/**!` (safe:true).', function () {
    var fixture = read('test/fixtures/strip-all.js');
    var actual = strip.block(fixture, {safe:true});
    var expected = read('test/expected/strip-keep-block.js');
    normalize(actual).should.eql(normalize(expected));
  });
  it('should strip only all line comments that not starts with `//!` (safe:true).', function () {
    var fixture = read('test/fixtures/strip-keep-line.js');
    var actual = strip.line(fixture, {safe:true});
    var expected = read('test/expected/strip-keep-line.js');
    normalize(actual).should.eql(normalize(expected));
  });
});

describe('block comments:', function () {
  it('should strip block comments from a function.', function () {
    var actual = strip.block('var bar = function(/* this is a comment*/) {return;};');
    var expected = 'var bar = function() {return;};';
    normalize(actual).should.eql(normalize(expected));
  });

  it('should strip block comments before and from a function.', function () {
    var actual = strip.block('/* this is a comment */\nvar bar = function(/*this is a comment*/) {return;};');
    var expected = 'var bar = function() {return;};';
    normalize(actual).should.eql(normalize(expected));
  });

  it('should strip block comments before, after and from a function.', function () {
    var actual = strip.block('/* this is a comment */var bar = function(/*this is a comment*/) {return;};\n/* this is a comment*/');
    var expected = 'var bar = function() {return;};\n';
    normalize(actual).should.eql(normalize(expected));
  });
});

describe('line comments:', function () {
  it('should strip line comments.', function () {
    var actual = strip.line('// this is a line comment\nvar bar = function(/*this is a comment*/) {return;};');
    var expected = '\nvar bar = function(/*this is a comment*/) {return;};';
    normalize(actual).should.eql(normalize(expected));
  });

  it('should strip line comments with leading whitespace.', function () {
    var actual = strip.line(' //                           this should be stripped');
    var expected = '';
    normalize(actual).should.eql(normalize(expected));
  });

  it('should not strip line comments in variables.', function () {
    var actual = strip.line('var foo = "//this is not a comment";');
    var expected = 'var foo = "//this is not a comment";';
    normalize(actual).should.eql(normalize(expected));
  });

  it('should not strip line comments in variables, but should after.', function () {
    var actual = strip.line('var foo = "//this is not a comment"; //this should be stripped');
    var expected = 'var foo = "//this is not a comment";';
    normalize(actual).should.eql(normalize(expected));
  });

  it('should not be whitespace sensitive.', function () {
    var actual = strip.line('var foo = "//this is not a comment"; //                           this should be stripped');
    var expected = 'var foo = "//this is not a comment";';
    normalize(actual).should.eql(normalize(expected));
  });

  it('should not strip URLs in a variable.', function () {
    var actual = strip.line('var foo = "http://github.com"; //                           this should be stripped');
    var expected = 'var foo = "http://github.com";';
    normalize(actual).should.eql(normalize(expected));
  });

  it('should strip URLs in a line comment.', function () {
    var actual = strip.line('// http://github.com"');
    var expected = '';
    normalize(actual).should.eql(normalize(expected));
  });

  it('should strip URLs in a block comment.', function () {
    var actual = strip.block('/**\n* http://github.com\n *\n */');
    var expected = '';
    normalize(actual).should.eql(normalize(expected));
  });

  it('should strip line comments before a function, and not block comments.', function () {
    var actual = strip.line('/* this is a comment */\n//this is a comment\nvar bar = function(/*this is a comment*/) {return;};');
    var expected = '/* this is a comment */\n\nvar bar = function(/*this is a comment*/) {return;};';
    normalize(actual).should.eql(normalize(expected));
  });

  it('should strip line comments before and after a function, and not block comments.', function () {
    var actual = strip.line('/* this is a comment */\n//this is a comment\nvar bar = function(/*this is a comment*/) {return;};\n//this is a line comment');
    var expected = '/* this is a comment */\n\nvar bar = function(/*this is a comment*/) {return;};\n';
    normalize(actual).should.eql(normalize(expected));
  });
});
