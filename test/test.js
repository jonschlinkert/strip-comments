/*!
 * strip-comments <https://github.com/jonschlinkert/strip-comments>
 *
 * Copyright (c) 2014-2018, Jon Schlinkert.
 * Released under the MIT license.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const strip = require('../index');
const read = src => fs.readFileSync(src, 'utf-8');

describe('strip:', function() {
  it('should strip all comments.', function() {
    const actual = strip("'foo'; // this is a comment\n/* me too */ var abc = 'xyz';");
    assert.strictEqual(actual, '\'foo\'; \n var abc = \'xyz\';');
  });

  it('should strip line comments.', function() {
    const actual = strip.line('foo // this is a comment\n/* me too */');
    const expected = 'foo \n/* me too */';
    assert.strictEqual(actual, expected);
  });

  it('should not mistake escaped slashes for comments', function() {
    // see https://github.com/jonschlinkert/extract-comments/issues/12
    const str = "'foo/bar'.replace(/o\\//, 'g')";
    const actual = strip.line(str);
    assert.deepEqual(actual, str);
  });

  it('should strip block comments.', function() {
    const actual = strip.block('foo // this is a comment\n/* me too */');
    const expected = 'foo // this is a comment\n';
    assert.strictEqual(actual, expected);
  });

  it('should only strip the first comment', function() {
    // see https://github.com/jonschlinkert/strip-comments/issues/31
    const expected = read('test/expected/banner.js');
    const fixture = read('test/fixtures/banner.js');
    const actual = strip.first(fixture);
    assert.strictEqual(actual, expected);
  });

  it('should strip the first non-protected comment', function() {
    // see https://github.com/jonschlinkert/strip-comments/issues/31
    const expected = read('test/expected/banner-protected.js');
    const fixture = read('test/fixtures/banner.js');
    const actual = strip.first(fixture, { keepProtected: true });
    assert.strictEqual(actual, expected);
  });

  it('should not strip non-comments in string literals', function() {
    // see https://github.com/jonschlinkert/strip-comments/issues/21
    const str = read('test/fixtures/config.js');
    const actual = strip(str);
    assert.equal(actual, str);
  });

  it('should not strip non-comments in quoted strings', function() {
    // see https://github.com/jonschlinkert/strip-comments/issues/21
    const str = read('test/fixtures/quoted-strings.js');
    const actual = strip(str);
    assert.equal(actual, str);
  });

  it('should not hang on unclosed comments', function() {
    // see https://github.com/jonschlinkert/strip-comments/issues/18
    const str = 'if (accept == \'video/*\') {';
    const actual = strip(str);
    // fails because using `esprima` under the hood
    assert.equal(actual, str);
  });

  it('should not mangle json', function() {
    const str = read(path.join(process.cwd(), 'package.json'));
    const before = JSON.parse(str);
    const res = strip(str);
    const after = JSON.parse(res);
    // fails because using `esprima` under the hood
    assert.deepEqual(before, after);
  });

  it('should strip all but not `/*/`', function() {
    const actual = strip("/* I will be stripped */\nvar path = '/this/should/*/not/be/stripped';");
    const expected = "\nvar path = '/this/should/*/not/be/stripped';";
    assert.strictEqual(actual, expected);
  });

  it('should strip all but not globstars `/**/*` #1', function() {
    const actual = strip("var path = './do/not/strip/globs/**/*.js';");
    const expected = "var path = './do/not/strip/globs/**/*.js';";
    assert.strictEqual(actual, expected);
  });

  it('should strip all but not globstars `/**/` #2 and `//!` line comments (safe: true)', function() {
    const actual = strip('var partPath = \'./path/*/to/scripts/**/\'; //! line comment', {safe: true});
    const expected = 'var partPath = \'./path/*/to/scripts/**/\'; //! line comment';
    assert.strictEqual(actual, expected);
  });

  it('should strip all but not `/*/*something` from anywhere', function() {
    const actual = strip('var partPath = \'./path/*/*something/test.txt\';');
    const expected = 'var partPath = \'./path/*/*something/test.txt\';';
    assert.strictEqual(actual, expected);
  });

  it('should strip all but not `/*/*something/*.js` from anywhere (globstar-like)', function() {
    const actual = strip('var partPath = \'./path/*/*something/*.js\';');
    const expected = "var partPath = './path/*/*something/*.js';";
    assert.strictEqual(actual, expected);
  });

  it('should leave alone code without any comments', function() {
    const fixture = read('test/fixtures/no-comment.js');
    const actual = strip(fixture);
    const expected = fixture;
    assert.strictEqual(actual, expected);
  });

  it('should not break on comments that are substrings of a later comment', function() {
    // see https://github.com/jonschlinkert/strip-comments/issues/27
    const actual = strip([
      '// this is a substring',
      '// this is a substring of a larger comment',
      'someCode();',
      'someMoreCode();'
    ].join('\n'));
    const expected = [
      '',
      '',
      'someCode();',
      'someMoreCode();'
    ].join('\n');
    assert.strictEqual(actual, expected);
  });
});

describe('error handling:', function() {
  it('should throw TypeError when a string is not passed', function(cb) {
    function fixture() {
      strip(123);
    }
    assert.throws(fixture, TypeError);
    assert.throws(fixture, /expected a string/);
    cb();
  });

  it('should throw TypeError when a string is not passed to `.block`', function(cb) {
    function fixture() {
      strip.block(123);
    }
    assert.throws(fixture, TypeError);
    assert.throws(fixture, /expected a string/);
    cb();
  });

  it('should throw TypeError when a string is not passed to `.line`', function(cb) {
    function fixture() {
      strip.line(123);
    }
    assert.throws(fixture, TypeError);
    assert.throws(fixture, /expected a string/);
    cb();
  });

  it('should not throw on empty string, returns empty string', function(cb) {
    const actual = strip('');
    const expected = '';
    assert.strictEqual(typeof actual, 'string');
    assert.strictEqual(actual, expected, 'expect empty string on empty string passed');
    cb();
  });
});

describe('strip all or empty:', function() {
  it('should strip all multiline, singleline, block and line comments.', function() {
    const fixture = read('test/fixtures/strip-all.js');
    const expected = read('test/expected/strip-all.js');
    const actual = strip(fixture);
    assert.strictEqual(actual, expected);
  });

  it('should not strip !important block comments', function() {
    const fixture = read('test/fixtures/strip-all.js');
    const actual = strip.block(fixture, { safe: true });
    const expected = read('test/expected/strip-keep-block.js');
    assert.strictEqual(actual, expected);
  });

  it('should strip only all line comments that not starts with `//!` (safe:true).', function() {
    const fixture = read('test/fixtures/strip-keep-line.js');
    const actual = strip.line(fixture, { safe: true });
    const expected = read('test/expected/strip-keep-line.js');
    assert.strictEqual(actual, expected);
  });
});

describe('strip all keep newlines:', function() {
  it('should strip all comments, but keep newlines.', function() {
    const fixture = read('test/fixtures/strip-all.js');
    const expected = read('test/expected/strip-keep-newlines.js');
    const actual = strip(fixture, { preserveNewlines: true });
    assert.strictEqual(actual, expected);
  });
});

describe('block comments:', function() {
  it('should strip block comments from a function.', function() {
    const actual = strip.block('var bar = function(/* this is a comment*/) {return;};');
    const expected = 'var bar = function() {return;};';
    assert.strictEqual(actual, expected);
  });

  it('should strip block comments before and from a function.', function() {
    const actual = strip.block('/* this is a comment */\nvar bar = function(/*this is a comment*/) {return;};');
    const expected = '\nvar bar = function() {return;};';
    assert.strictEqual(actual, expected);
  });

  it('should strip block comments before, after and from a function.', function() {
    const actual = strip.block('/* this is a comment */var bar = function(/*this is a comment*/) {return;};\n/* this is a comment*/');
    const expected = 'var bar = function() {return;};\n';
    assert.strictEqual(actual, expected);
  });
});

describe('line comments:', function() {
  it('should strip line comments.', function() {
    const actual = strip.line('// this is a line comment\nvar bar = function(/*this is a comment*/) {return;};');
    const expected = '\nvar bar = function(/*this is a comment*/) {return;};';
    assert.strictEqual(actual, expected);
  });

  it('should strip line comments with leading whitespace.', function() {
    const actual = strip.line(' //                           this should be stripped');
    const expected = ' ';
    assert.strictEqual(actual, expected);
  });

  it('should not strip line comments in quoted strings.', function() {
    const actual = strip.line('var foo = "//this is not a comment";');
    const expected = 'var foo = "//this is not a comment";';
    assert.strictEqual(actual, expected);
  });

  it('should strip line comments after quoted strings', function() {
    const actual = strip.line('var foo = "//this is not a comment"; //this should be stripped');
    const expected = 'var foo = "//this is not a comment"; ';
    assert.strictEqual(actual, expected);
  });

  it('should not be whitespace sensitive.', function() {
    const actual = strip.line('var foo = "//this is not a comment"; //                           this should be stripped');
    const expected = 'var foo = "//this is not a comment"; ';
    assert.strictEqual(actual, expected);
  });

  it('should not strip URLs in a quoted string.', function() {
    const actual = strip.line('var foo = "http://github.com"; //                           this should be stripped');
    const expected = 'var foo = "http://github.com"; ';
    assert.strictEqual(actual, expected);
  });

  it('should strip URLs in a line comment.', function() {
    const actual = strip.line('// http://github.com"');
    const expected = '';
    assert.strictEqual(actual, expected);
  });

  it('should strip URLs in a block comment.', function() {
    const actual = strip.block('/**\n* http://github.com\n *\n */');
    const expected = '';
    assert.strictEqual(actual, expected);
  });

  it('should strip line comments before a function, and not block comments.', function() {
    const actual = strip.line('/* this is a comment */\n//this is a comment\nvar bar = function(/*this is a comment*/) {return;};');
    const expected = '/* this is a comment */\n\nvar bar = function(/*this is a comment*/) {return;};';
    assert.strictEqual(actual, expected);
  });

  it('should strip line comments before and after a function, and not block comments.', function() {
    const actual = strip.line('/* this is a comment */\n//this is a comment\nvar bar = function(/*this is a comment*/) {return;};\n//this is a line comment');
    const expected = '/* this is a comment */\n\nvar bar = function(/*this is a comment*/) {return;};\n';
    assert.strictEqual(actual, expected);
  });
});
