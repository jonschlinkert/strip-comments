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

const fixture = path.join.bind(path, __dirname, 'fixtures/html');
const expected = path.join.bind(path, __dirname, 'expected/html');
const read = src => fs.readFileSync(src, 'utf-8').replace(/\r*\n/g, '\n');

describe('HTML comments', () => {
  it('should strip HTML comments.', () => {
    const actual = strip('No <!-- I should be gone-->comment', { language: 'html' });
    assert.strictEqual(actual, 'No comment');
  });

  it('should not strip comments inside quoted strings.', () => {
    const input = 'No "<!-- I should NOT be gone-->"comment';
    const actual = strip(input, { language: 'html' });
    assert.strictEqual(actual, input);
  });

  it('should not strip comment _parts_ inside quoted strings.', () => {
    const name = 'quoted';
    const input = read(fixture(`${name}.html`));
    const output = read(expected(`${name}.html`));
    const actual = strip(input, { language: 'html' });
    assert.strictEqual(actual, output);
  });

  it('should strip multiline comments', () => {
    const name = 'multiline';
    const input = read(fixture(`${name}.html`));
    const output = read(expected(`${name}.html`));
    const actual = strip(input, { language: 'html' });
    assert.strictEqual(actual, output);
  });

  it('should strip comments with only dashes', () => {
    const name = 'dashes';
    const input = read(fixture(`${name}.html`));
    const output = read(expected(`${name}.html`));
    const actual = strip(input, { language: 'html' });
    assert.strictEqual(actual, output);
  });
});
