/* -*- coding: UTF-8, tab-width: 2 -*- */
/*jslint indent: 2, maxlen: 150, node: true, vars: true */
/*global describe: true, it: true */

const expect = require('chai').expect;
const file = require('fs-utils');
const strip = require('../');
const testDir = file.dirname(module.filename);

const blCmt = '/* some block comment */';
const lnCmt = '// some line comment';
const barFuncHead = 'var bar = function(';
const blExclamCmt = '/*! this is a comment */';


function getTestData(fn) {
  /*jslint stupid: true */
  var src = file.readFileSync(testDir + fn);
  /*jslint stupid: false */
  return src;
}


function markedExpectedOmissions(meo, censorFunc, markChar) {
  if (!markChar) { markChar = '°'; }
  var eoRgx = new RegExp(markChar + '<([^' + markChar + ']*)>' + markChar, 'g');
  if (Array.isArray(meo)) { meo = meo.join('\n'); }
  meo = {
    expected: meo.replace(eoRgx, ''),
    input: meo.replace(eoRgx, '$1'),
  };
  if ('function' === typeof censorFunc) {
    meo.output = censorFunc(meo.input);
  }
  return meo;
}




describe('empty:', function () {
  it('should not throw an error at an empty string.', function () {
    var actual = strip();
    var expected = '';
    expect(actual).to.eql(expected);
  });
});

describe('when `strip.banner` is used:', function () {
  it('should strip banners only.', function () {
    var fixture = getTestData('fixtures/banner-strip.js');
    var actual = strip.banner(fixture);
    var expected = getTestData('expected/banner-strip.js');
    expect(actual).to.eql(expected);
  });
});

describe('when `strip.banner` is used, and options.safe is specified:', function () {
  it('should strip banners, except for protected banners.', function () {
    var fixture = getTestData('fixtures/banner-keep.js');
    var actual = strip.banner(fixture, {safe: true});
    var expected = getTestData('expected/banner-protected.js');
    expect(actual).to.eql(expected);
  });
});


describe('all except banners:', function () {
  it('should strip all block comments except banner.', function () {
    var fixture = getTestData('fixtures/banner-keep.js');
    var actual = strip.safeBlock(fixture);
    var expected = getTestData('expected/banner-keep.js');
    expect(actual).to.eql(expected);
  });

  it('should strip all comments, block and line, except banner.', function () {
    var fixture = getTestData('fixtures/all-but-banner.js');
    var actual = strip.safeBlock(strip.line(fixture));
    var expected = getTestData('expected/all-but-banner.js');
    expect(actual).to.eql(expected);
  });
});

describe('all comments:', function () {
  it('should strip all comments, line and block.', function () {
    var actual = strip(lnCmt + '\n' +
      barFuncHead + blCmt + ') {return;};\n' +
      lnCmt);
    var expected = '\n' + barFuncHead + ') {return;};\n';
    expect(actual).to.eql(expected);
  });

  it('should strip all comments, even block c. before line c..', function () {
    var actual = strip(blCmt + '\n' +
      lnCmt + '\n' +
      barFuncHead + blCmt + ') {return;};');
    var expected = '\n\n' + barFuncHead + ') {return;};';
    expect(actual).to.eql(expected);
  });

  it('should strip all comments including one with an exclamation at the beginning.', function () {
    var actual = strip(blExclamCmt + '\n' +
      lnCmt + '\n' +
      barFuncHead + blCmt + ') {return;};');
    var expected = '\n\n' + barFuncHead + ') {return;};';
    expect(actual).to.eql(expected);
  });

  it('should strip all comments, even line c. in last line w/o newline.', function () {
    var actual = strip(blCmt + '\n' +
      lnCmt + '\n' +
      barFuncHead + blCmt + ') {return;};\n'
        + lnCmt);
    var expected = '\n\n' + barFuncHead + ') {return;};\n';
    expect(actual).to.eql(expected);
  });

  it('should strip all comments, even inside function body.', function () {
    var meo = markedExpectedOmissions([
      barFuncHead + ') {',
      '°<' + blCmt + '>°',
      '°<' + lnCmt + '>°',
      'return;',
      '°<' + blCmt + '>°',
      '°<' + lnCmt + '>°',
      '};'
    ], strip);
    expect(meo.output).to.eql(meo.expected);
  });

  it('should strip all comments, even indented line comments.', function () {
    var meo = markedExpectedOmissions([
      barFuncHead + ') {',
      '°<' + blCmt + '>°',
      '°<  ' + lnCmt + '>°',
      'return;',
      '°<' + blCmt + '>°',
      '°<\t' + lnCmt + '>°',
      '};'
    ], strip);
    expect(meo.output).to.eql(meo.expected);
  });

  it('should strip all comments, even indented block comments.', function () {
    var meo = markedExpectedOmissions([
      barFuncHead + ') {',
      '°<  ' + blCmt + '>°',
      '°<' + lnCmt + '>°',
      'return;',
      '°<\t' + blCmt + '>°',
      '°<' + lnCmt + '>°',
      '};'
    ], strip);
    expect(meo.output).to.eql(meo.expected);
  });
});

describe('block comments:', function () {
  it('should strip block comments from a function.', function () {
    var actual = strip.block(barFuncHead + blCmt + ') {return;};');
    var expected = barFuncHead + ') {return;};';
    expect(actual).to.eql(expected);
  });

  it('should strip block comments before and from a function.', function () {
    var actual = strip.block(blCmt + '\n' +
      barFuncHead + blCmt + ') {return;};');
    var expected = '\n' + barFuncHead + ') {return;};';
    expect(actual).to.eql(expected);
  });

  it('should strip block comments before, after and from a function.', function () {
    var actual = strip.block(blCmt + barFuncHead + blCmt + ') {return;};\n' +
      blCmt);
    var expected = barFuncHead + ') {return;};\n';
    expect(actual).to.eql(expected);
  });
});

describe('line comments:', function () {
  it('should strip line comments, keep block comments.', function () {
    var actual = strip.line(lnCmt + '\n' +
      barFuncHead + blCmt + ') {return;};');
    var expected = '\n' + barFuncHead + blCmt + ') {return;};';
    expect(actual).to.eql(expected);
  });

  it('should strip line comments before a function, and not block comments.', function () {
    var actual = strip.line(blCmt + '\n' +
      lnCmt + '\n' +
      barFuncHead + blCmt + ') {return;};');
    var expected = blCmt + '\n\n' + barFuncHead + blCmt + ') {return;};';
    expect(actual).to.eql(expected);
  });

  it('should strip line comments before and after a function, and not block comments.', function () {
    var actual = strip.line(blCmt + '\n' +
      lnCmt + '\n' +
      barFuncHead + blCmt + ') {return;};\n'
        + lnCmt);
    var expected = blCmt + '\n\n' + barFuncHead + blCmt + ') {return;};\n';
    expect(actual).to.eql(expected);
  });
});