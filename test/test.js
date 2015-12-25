'use strict';

require('mocha');
require('should');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var strip = require('..');

function read(src) {
  return fs.readFileSync(src, 'utf-8');
}

describe('strip:', function() {
  it('should strip all comments.', function() {
    var actual = strip("'foo'; // this is a comment\n/* me too */ var abc = 'xyz';");
    var expected = [
      '\'foo\'; ',
      ' var abc = \'xyz\';',
    ].join('\n');
    assert.equal(actual, expected);
  });

  it('should strip line comments.', function() {
    var actual = strip.line('foo // this is a comment\n/* me too */');
    var expected = 'foo \n/* me too */';
    assert.equal(actual, expected);
  });

  it('should not mistake escaped slashes for comments', function() {
    // see https://github.com/jonschlinkert/extract-comments/issues/12
    var str = "'foo/bar'.replace(/o\\//, 'g')";
    var actual = strip.line(str);
    assert.deepEqual(actual, str);
  });

  it('should strip block comments.', function() {
    var actual = strip.block('foo // this is a comment\n/* me too */');
    var expected = 'foo // this is a comment\n';
    assert.equal(actual, expected);
  });

  it('should not strip non-comments in string literals', function() {
    // see https://github.com/jonschlinkert/strip-comments/issues/21
    var str = read('test/fixtures/config.js');
    var actual = strip(str);
    assert.equal(actual, str);
  });

  it('should not strip non-comments in quoted strings', function() {
    // see https://github.com/jonschlinkert/strip-comments/issues/21
    var str = read('test/fixtures/quoted-strings.js');
    var actual = strip(str);
    assert.equal(actual, str);
  });

  it('should not hang on unclosed comments', function() {
    // see https://github.com/jonschlinkert/strip-comments/issues/18
    var str = 'if (accept == \'video/*\') {';
    var actual = strip(str);
    assert.equal(actual, str);
  });

  it('should not mangle json', function() {
    var str = read(path.join(process.cwd(), 'package.json'));
    var before = JSON.parse(str);
    var res = strip(str);
    var after = JSON.parse(res);
    assert.deepEqual(before, after);
  });

  it('should strip all but not `/*/`', function() {
    var actual = strip("/* I will be stripped */\nvar path = '/this/should/*/not/be/stripped';");
    var expected = "\nvar path = '/this/should/*/not/be/stripped';";
    assert.equal(actual, expected);
  });

  it('should strip all but not globstars `/**/*` #1', function() {
    var actual = strip("var path = './do/not/strip/globs/**/*.js';");
    var expected = "var path = './do/not/strip/globs/**/*.js';";
    assert.equal(actual, expected);
  });

  it('should strip all but not globstars `/**/` #2 and `//!` line comments (safe: true)', function() {
    var actual = strip('var partPath = \'./path/*/to/scripts/**/\'; //! line comment', {safe: true});
    var expected = 'var partPath = \'./path/*/to/scripts/**/\'; //! line comment';
    assert.equal(actual, expected);
  });

  it('should strip all but not `/*/*something` from anywhere', function() {
    var actual = strip('var partPath = \'./path/*/*something/test.txt\';');
    var expected = 'var partPath = \'./path/*/*something/test.txt\';';
    assert.equal(actual, expected);
  });

  it('should strip all but not `/*/*something/*.js` from anywhere (globstar-like)', function() {
    var actual = strip('var partPath = \'./path/*/*something/*.js\';');
    var expected = "var partPath = './path/*/*something/*.js';";
    assert.equal(actual, expected);
  });

  it('should leave alone code without any comments', function() {
    var fixture = read('test/fixtures/no-comment.js');
    var actual = strip(fixture);
    var expected = fixture;
    assert.equal(actual, expected);
  });

  it('should not break on comments that are substrings of a later comment', function() {
    // see https://github.com/jonschlinkert/strip-comments/issues/27
    var actual = strip([
      '// this is a substring',
      '// this is a substring of a larger comment',
      'someCode();',
      'someMoreCode();'
    ].join('\n'));
    var expected = [
      '',
      '',
      'someCode();',
      'someMoreCode();'
    ].join('\n');
    assert.equal(actual, expected);
  });
});

describe('error handling:', function() {
  it('should throw an error on empty strings', function(cb) {
    try {
      strip.block();
      cb(new Error('expected an error'));
    } catch(err) {
      assert(err);
      assert(err.message);
      assert(err.message === 'expected a string');
      cb();
    }
  });

  it('should throw an error when empty strings are passed to "block"', function(cb) {
    try {
      strip.block();
      cb(new Error('expected an error'));
    } catch(err) {
      assert(err);
      assert(err.message);
      assert(err.message === 'expected a string');
      cb();
    }
  });

  it('should throw an error when empty strings are passed to "line"', function(cb) {
    try {
      strip.block();
      cb(new Error('expected an error'));
    } catch(err) {
      assert(err);
      assert(err.message);
      assert(err.message === 'expected a string');
      cb();
    }
  });
});

describe('strip all or empty:', function() {
  it('should strip all multiline, singleline, block and line comments.', function() {
    var fixture = read('test/fixtures/strip-all.js');
    var expected = read('test/expected/strip-all.js');
    var actual = strip(fixture);
    actual.should.equal(expected);
  });

  it('should not strip !important block comments', function() {
    var fixture = read('test/fixtures/strip-all.js');
    var actual = strip.block(fixture, { safe: true });
    var expected = read('test/expected/strip-keep-block.js');
    assert.equal(actual, expected);
  });

  it('should strip only all line comments that not starts with `//!` (safe:true).', function() {
    var fixture = read('test/fixtures/strip-keep-line.js');
    var actual = strip.line(fixture, { safe: true });
    var expected = read('test/expected/strip-keep-line.js');
    assert.equal(actual, expected);
  });
});

describe('block comments:', function() {
  it('should strip block comments from a function.', function() {
    var actual = strip.block('var bar = function(/* this is a comment*/) {return;};');
    var expected = 'var bar = function() {return;};';
    assert.equal(actual, expected);
  });

  it('should strip block comments before and from a function.', function() {
    var actual = strip.block('/* this is a comment */\nvar bar = function(/*this is a comment*/) {return;};');
    var expected = '\nvar bar = function() {return;};';
    assert.equal(actual, expected);
  });

  it('should strip block comments before, after and from a function.', function() {
    var actual = strip.block('/* this is a comment */var bar = function(/*this is a comment*/) {return;};\n/* this is a comment*/');
    var expected = 'var bar = function() {return;};\n';
    assert.equal(actual, expected);
  });
});

describe('line comments:', function() {
  it('should strip line comments.', function() {
    var actual = strip.line('// this is a line comment\nvar bar = function(/*this is a comment*/) {return;};');
    var expected = '\nvar bar = function(/*this is a comment*/) {return;};';
    assert.equal(actual, expected);
  });

  it('should strip line comments with leading whitespace.', function() {
    var actual = strip.line(' //                           this should be stripped');
    var expected = ' ';
    assert.equal(actual, expected);
  });

  it('should not strip line comments in quoted strings.', function() {
    var actual = strip.line('var foo = "//this is not a comment";');
    var expected = 'var foo = "//this is not a comment";';
    assert.equal(actual, expected);
  });

  it('should strip line comments after quoted strings', function() {
    var actual = strip.line('var foo = "//this is not a comment"; //this should be stripped');
    var expected = 'var foo = "//this is not a comment"; ';
    assert.equal(actual, expected);
  });

  it('should not be whitespace sensitive.', function() {
    var actual = strip.line('var foo = "//this is not a comment"; //                           this should be stripped');
    var expected = 'var foo = "//this is not a comment"; ';
    assert.equal(actual, expected);
  });

  it('should not strip URLs in a quoted string.', function() {
    var actual = strip.line('var foo = "http://github.com"; //                           this should be stripped');
    var expected = 'var foo = "http://github.com"; ';
    assert.equal(actual, expected);
  });

  it('should strip URLs in a line comment.', function() {
    var actual = strip.line('// http://github.com"');
    var expected = '';
    assert.equal(actual, expected);
  });

  it('should strip URLs in a block comment.', function() {
    var actual = strip.block('/**\n* http://github.com\n *\n */');
    var expected = '';
    assert.equal(actual, expected);
  });

  it('should strip line comments before a function, and not block comments.', function() {
    var actual = strip.line('/* this is a comment */\n//this is a comment\nvar bar = function(/*this is a comment*/) {return;};');
    var expected = '/* this is a comment */\n\nvar bar = function(/*this is a comment*/) {return;};';
    assert.equal(actual, expected);
  });

  it('should strip line comments before and after a function, and not block comments.', function() {
    var actual = strip.line('/* this is a comment */\n//this is a comment\nvar bar = function(/*this is a comment*/) {return;};\n//this is a line comment');
    var expected = '/* this is a comment */\n\nvar bar = function(/*this is a comment*/) {return;};\n';
    assert.equal(actual, expected);
  });
});
