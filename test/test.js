const expect = require('chai').expect;
const file = require('fs-utils');
const strip = require('../');


describe('empty:', function () {
  it('should not throw an error at an empty string.', function () {
    var actual = strip();
    var expected = '';
    expect(actual).to.eql(expected);
  });
});

describe('when `strip.banner` is used:', function () {
  it('should strip banners only.', function () {
    var fixture = file.readFileSync('test/fixtures/banner-strip.js');
    var actual = strip.banner(fixture);
    var expected = file.readFileSync('test/expected/banner-strip.js');
    expect(actual).to.eql(expected);
  });
});

describe('when `strip.banner` is used, and options.safe is specified:', function () {
  it('should strip banners, except for protected banners.', function () {
    var fixture = file.readFileSync('test/fixtures/banner-keep.js');
    var actual = strip.banner(fixture, {safe: true});
    var expected = file.readFileSync('test/expected/banner-protected.js');
    expect(actual).to.eql(expected);
  });
});


describe('all except banners:', function () {
  it('should strip all block comments except banner.', function () {
    var fixture = file.readFileSync('test/fixtures/banner-keep.js');
    var actual = strip.safeBlock(fixture);
    var expected = file.readFileSync('test/expected/banner-keep.js');
    expect(actual).to.eql(expected);
  });

  it('should strip all comments, block and line, except banner.', function () {
    var fixture = file.readFileSync('test/fixtures/all-but-banner.js');
    var actual = strip.safeBlock(strip.line(fixture));
    var expected = file.readFileSync('test/expected/all-but-banner.js');
    expect(actual).to.eql(expected);
  });
});

describe('all comments:', function () {
  it('should strip all comments.', function () {
    var actual = strip('// this is a line comment\nvar bar = function(/*this is a comment*/) {return;};');
    var expected = '\nvar bar = function() {return;};';
    expect(actual).to.eql(expected);
  });

  it('should strip all comments.', function () {
    var actual = strip('/* this is a comment */\n//this is a comment\nvar bar = function(/*this is a comment*/) {return;};');
    var expected = '\n\nvar bar = function() {return;};';
    expect(actual).to.eql(expected);
  });

  it('should strip all comments including one with an exclamation at the beginning.', function () {
    var actual = strip('/*! this is a comment */\n//this is a comment\nvar bar = function(/*this is a comment*/) {return;};');
    var expected = '\n\nvar bar = function() {return;};';
    expect(actual).to.eql(expected);
  });

  it('should strip all comments.', function () {
    var actual = strip('/* this is a comment */\n//this is a comment\nvar bar = function(/*this is a comment*/) {return;};\n//this is a line comment');
    var expected = '\n\nvar bar = function() {return;};\n';
    expect(actual).to.eql(expected);
  });
});

describe('block comments:', function () {
  it('should strip block comments from a function.', function () {
    var actual = strip.block('var bar = function(/*this is a comment*/) {return;};');
    var expected = 'var bar = function() {return;};';
    expect(actual).to.eql(expected);
  });

  it('should strip block comments before and from a function.', function () {
    var actual = strip.block('/* this is a comment */\nvar bar = function(/*this is a comment*/) {return;};');
    var expected = '\nvar bar = function() {return;};';
    expect(actual).to.eql(expected);
  });

  it('should strip block comments before, after and from a function.', function () {
    var actual = strip.block('/* this is a comment */var bar = function(/*this is a comment*/) {return;};\n/* this is a comment*/');
    var expected = 'var bar = function() {return;};\n';
    expect(actual).to.eql(expected);
  });
});

describe('line comments:', function () {
  it('should strip line comments.', function () {
    var actual = strip.line('// this is a line comment\nvar bar = function(/*this is a comment*/) {return;};');
    var expected = '\nvar bar = function(/*this is a comment*/) {return;};';
    expect(actual).to.eql(expected);
  });

  it('should strip line comments before a function, and not block comments.', function () {
    var actual = strip.line('/* this is a comment */\n//this is a comment\nvar bar = function(/*this is a comment*/) {return;};');
    var expected = '/* this is a comment */\n\nvar bar = function(/*this is a comment*/) {return;};';
    expect(actual).to.eql(expected);
  });

  it('should strip line comments before and after a function, and not block comments.', function () {
    var actual = strip.line('/* this is a comment */\n//this is a comment\nvar bar = function(/*this is a comment*/) {return;};\n//this is a line comment');
    var expected = '/* this is a comment */\n\nvar bar = function(/*this is a comment*/) {return;};\n';
    expect(actual).to.eql(expected);
  });
});