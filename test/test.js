const expect = require('chai').expect;
const file = require('fs-utils');
const strip = require('../');
const testDir = file.dirname(module.filename);

const blCmt = '/* some block comment */';
const lnCmt = '// some line comment';
const barFuncHead = 'var bar = function(';
const blExclamCmt = '/*! this is a comment */';


describe('empty:', function () {
  it('should not throw an error at an empty string.', function () {
    var actual = strip();
    var expected = '';
    expect(actual).to.eql(expected);
  });
});

describe('when `strip.banner` is used:', function () {
  it('should strip banners only.', function () {
    var fixture = file.readFileSync(testDir + 'fixtures/banner-strip.js');
    var actual = strip.banner(fixture);
    var expected = file.readFileSync(testDir + 'expected/banner-strip.js');
    expect(actual).to.eql(expected);
  });
});

describe('when `strip.banner` is used, and options.safe is specified:', function () {
  it('should strip banners, except for protected banners.', function () {
    var fixture = file.readFileSync(testDir + 'fixtures/banner-keep.js');
    var actual = strip.banner(fixture, {safe: true});
    var expected = file.readFileSync(testDir + 'expected/banner-protected.js');
    expect(actual).to.eql(expected);
  });
});


describe('all except banners:', function () {
  it('should strip all block comments except banner.', function () {
    var fixture = file.readFileSync(testDir + 'fixtures/banner-keep.js');
    var actual = strip.safeBlock(fixture);
    var expected = file.readFileSync(testDir + 'expected/banner-keep.js');
    expect(actual).to.eql(expected);
  });

  it('should strip all comments, block and line, except banner.', function () {
    var fixture = file.readFileSync(testDir + 'fixtures/all-but-banner.js');
    var actual = strip.safeBlock(strip.line(fixture));
    var expected = file.readFileSync(testDir + 'expected/all-but-banner.js');
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
    var actual = strip(barFuncHead + ') {\n' +
      blCmt + '\n' +
      lnCmt + '\n' +
      'return;\n' +
      blCmt + '\n' +
      lnCmt + '\n' +
      '};');
    var expected = barFuncHead + ') {\n\n\nreturn;\n\n\n};';
    expect(actual).to.eql(expected);
  });

  it('should strip all comments, even indented line comments.', function () {
    var actual = strip(barFuncHead + ') {\n' +
      blCmt + '\n' +
      '  ' + lnCmt + '\n' +
      'return;\n' +
      blCmt + '\n' +
      '\t' + lnCmt + '\n' +
      '};');
    var expected = barFuncHead + ') {\n\n\nreturn;\n\n\n};';
    expect(actual).to.eql(expected);
  });

  it('should strip all comments, even indented block comments.', function () {
    var actual = strip(barFuncHead + ') {\n' +
      '  ' + blCmt + '\n' +
      lnCmt + '\n' +
      'return;\n' +
      '\t' + blCmt + '\n' +
      lnCmt + '\n' +
      '};');
    var expected = barFuncHead + ') {\n\n\nreturn;\n\n\n};';
    expect(actual).to.eql(expected);
  });
});

describe('block comments:', function () {
  it('should strip block comments from a function.', function () {
    var actual = strip.block('' + barFuncHead + blCmt + ') {return;};');
    var expected = '' + barFuncHead + ') {return;};';
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
    var expected = '' + barFuncHead + ') {return;};\n';
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