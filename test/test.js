'use strict';

var fs = require('fs');
var spawn = require('child_process').spawn;
var should = require('should');
var strip = require('..');

function read(fp) {
  return fs.readFileSync(fp, 'utf-8');
}

function normalize(str) {
  return str.replace(/[\n\r\s]*/g, '');
}

function cli(args, cb) {
  var proc = spawn('strip', args, {
    stdio: 'inherit'
  });
  proc.on('error', function(err) {
    cb(err);
  });
  proc.on('exit', function (code) {
    if (code !== 0) {
      cb(code);
      return;
    }
    cb();
  });
}

describe('strip:', function () {
  it('should strip all comments.', function () {
    var actual = strip("foo // this is a comment\n/* me too */");
    normalize(actual).should.equal(normalize('foo'));
  });

  it('should strip block comments.', function () {
    var actual = strip.block("foo // this is a comment\n/* me too */");
    normalize(actual).should.equal(normalize('foo // this is a comment\n'));
  });

  it('should strip all but not `/*/`', function() {
    var actual = strip("/* I will be stripped */\nvar path = '/and/this/*/not/be/stripped';");
    normalize(actual).should.equal(normalize("\nvar path = '/and/this/*/not/be/stripped';"));
  });

  it('should strip all but not globstars `/**/*` #1', function() {
    var actual = strip("var path = './path/to/scripts/**/*.js';");
    normalize(actual).should.equal(normalize("var path = './path/to/scripts/**/*.js';"));
  });

  it('should strip all but not `/*/*something` from anywhere', function() {
    var actual = strip("var partPath = './path/*/*something/test.txt';");
    normalize(actual).should.equal(normalize("var partPath = './path/*/*something/test.txt';"));
  });

  it('should strip all but not `/*/*something/*.js` from anywhere (globstar-like)', function() {
    var actual = strip("var partPath = './path/*/*something/*.js';");
    normalize(actual).should.equal(normalize("var partPath = './path/*/*something/*.js';"));
  });
});

describe('strip all or empty:', function () {
  it('should not throw an error at an empty string.', function () {
    normalize(strip()).should.equal(normalize(''));
  });
  it('should strip all multiline, singleline, block and line comments.', function () {
    var fixture = read('test/fixtures/strip-all.js');
    var actual = strip(fixture);
    normalize(actual).should.equal(normalize(read('test/expected/strip-all.js')));
  });
  it('should strip only all block comments that not starts with `/*!` or `/**!` (safe:true).', function () {
    var fixture = read('test/fixtures/strip-all.js');
    var actual = strip.block(fixture, {safe:true});
    normalize(actual).should.equal(normalize(read('test/expected/strip-keep-block.js')));
  });
  it('should strip only all line comments that not starts with `//!` (safe:true).', function () {
    var fixture = read('test/fixtures/strip-keep-line.js');
    var actual = strip.line(fixture, {safe:true});
    normalize(actual).should.equal(normalize(read('test/expected/strip-keep-line.js')));
  });
});

describe('block comments:', function () {
  it('should strip block comments from a function.', function () {
    var actual = strip.block('var bar = function(/* this is a comment*/) {return;};');
    normalize(actual).should.equal(normalize('var bar = function() {return;};'));
  });

  it('should strip block comments before and from a function.', function () {
    var actual = strip.block('/* this is a comment */\nvar bar = function(/*this is a comment*/) {return;};');
    normalize(actual).should.equal(normalize('var bar = function() {return;};'));
  });

  it('should strip block comments before, after and from a function.', function () {
    var actual = strip.block('/* this is a comment */var bar = function(/*this is a comment*/) {return;};\n/* this is a comment*/');
    normalize(actual).should.equal(normalize('var bar = function() {return;};\n'));
  });
});

describe('comment-like patterns:', function () {
  it('should not strip comment-like code that is not a comment:', function() {
    var fixture = read('test/fixtures/literals/comment-like.js');
    var actual = strip(fixture);
    normalize(actual).should.equal(normalize(read('test/expected/comment-like.js')));
  });

  it('should not strip string literals that are similar to comments:', function() {
    var fixture = read('test/fixtures/literals/string.js');
    var actual = strip(fixture);
    normalize(actual).should.equal(normalize(read('test/expected/string.js')));
  });

  it('should not strip literals that are similar to comments:', function() {
    var fixture = read('test/fixtures/literals/all.js');
    var actual = strip(fixture);
    normalize(actual).should.equal(normalize(read('test/expected/all.js')));
  });
});

describe('line comments:', function () {
  it('should strip all but not globstars `/**/` #2 and `//!` line comments (safe:true)', function() {
    var actual = strip.line("var partPath = './path/*/to/scripts/**/'; //! line comment", {safe:true});
    normalize(actual).should.equal(normalize("var partPath = './path/*/to/scripts/**/'; //! line comment"));
  });

  it('should strip line comments.', function () {
    var actual = strip.line("foo // this is a comment\n/* me too */");
    normalize(actual).should.equal(normalize('foo\n/* me too */'));
  });

  it('should strip line comments.', function () {
    var actual = strip.line('// this is a line comment\nvar bar = function(/*this is a comment*/) {return;};');
    normalize(actual).should.equal(normalize('\nvar bar = function(/*this is a comment*/) {return;};'));
  });

  it('should strip line comments with leading whitespace.', function () {
    var actual = strip.line(' //                           this should be stripped');
    normalize(actual).should.equal(normalize(''));
  });

  it('should not strip line comments in variables.', function () {
    var actual = strip.line('var foo = "//this is not a comment";');
    normalize(actual).should.equal(normalize('var foo = "//this is not a comment";'));
  });

  it('should not strip line comments in variables, but should after.', function () {
    var actual = strip.line('var foo = "//this is not a comment"; //this should be stripped');
    normalize(actual).should.equal(normalize('var foo = "//this is not a comment";'));
  });

  it('should not be whitespace sensitive.', function () {
    var actual = strip.line('var foo = "//this is not a comment"; //                           this should be stripped');
    normalize(actual).should.equal(normalize('var foo = "//this is not a comment";'));
  });

  it('should not strip URLs in a variable.', function () {
    var actual = strip.line('var foo = "http://github.com"; //                           this should be stripped');
    normalize(actual).should.equal(normalize('var foo = "http://github.com";'));
  });

  it('should strip URLs in a line comment.', function () {
    var actual = strip.line('// http://github.com"');
    normalize(actual).should.equal(normalize(''));
  });

  it('should strip URLs in a block comment.', function () {
    var actual = strip.block('/**\n* http://github.com\n *\n */');
    normalize(actual).should.equal(normalize(''));
  });

  it('should strip line comments before a function, and not block comments.', function () {
    var actual = strip.line('/* this is a comment */\n//this is a comment\nvar bar = function(/*this is a comment*/) {return;};');
    var expected = '/* this is a comment */\n\nvar bar = function(/*this is a comment*/) {return;};';
    normalize(actual).should.equal(normalize(expected));
  });

  it('should strip line comments before and after a function, and not block comments.', function () {
    var actual = strip.line('/* this is a comment */\n//this is a comment\nvar bar = function(/*this is a comment*/) {return;};\n//this is a line comment');
    var expected = '/* this is a comment */\n\nvar bar = function(/*this is a comment*/) {return;};\n';
    normalize(actual).should.equal(normalize(expected));
  });
});

describe.skip('cli support', function() {
  it('should strip all multiline, singleline, block and line comments.', function (done) {
    this.timeout(10000);

    var args = [
      './cli.js',
      '--input', 'test/fixtures/strip-comments.js',
      '--output', 'test/actual/strip-comments-all.js',
      '--strip "all"'
    ];

    cli(args, function(e) {
      if (!e) {
        var actual = read('test/actual/strip-comments-all.js');
        var expected = read('test/expected/strip-comments-all.js');
        normalize(actual).should.equal(normalize(expected));
        done();
        return;
      }
      done(e);
    });
  });

  it('should strip only all block comments.', function (done) {
    this.timeout(10000);

    var args = [
      './cli.js',
      '--input', 'test/fixtures/strip-comments.js',
      '--output', 'test/actual/strip-comments-block.js',
      '--strip "block"'
    ];

    cli(args, function(e) {
      if (!e) {
        var actual = read('test/actual/strip-comments-block.js');
        var expected = read('test/expected/strip-comments-block.js');
        normalize(actual).should.equal(normalize(expected));
        done();
        return;
      }
      done(e);
    });
  });
  it('should strip only all line comments', function (done) {
    this.timeout(10000);

    var args = [
      './cli.js',
      '--input', 'test/fixtures/strip-comments.js',
      '--output', 'test/actual/strip-comments-line.js',
      '--strip "line"'
    ];

    cli(args, function(e) {
      if (!e) {
        var actual = read('test/actual/strip-comments-line.js');
        var expected = read('test/expected/strip-comments-line.js');
        normalize(actual).should.equal(normalize(expected));
        done();
        return;
      }
      done(e);
    });
  });
});
