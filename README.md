# strip-comments [![NPM version](https://badge.fury.io/js/strip-comments.svg)](http://badge.fury.io/js/strip-comments)

> Strip comments from code. Remove both line comments and block comments.

Should work with any language that uses the same syntax, e.g. JavaScript, LESS, SASS/SCSS, CSS.

## Install

### [npm](npmjs.org)

```bash
 npm i strip-comments --save
 ```

### [bower](https://github.com/bower/bower)

```bash
 npm install strip-comments --save
 ```

## API
### Table of contents
- [strip](#stripstr-opts)
- [strip.block()](#stripblockstr-opts)
- [strip.line()](#striplinestr-opts)

### strip(str[, opts])
Strip all comments

- `str` **{String}** file content or string to strip to
- `opts` **{Object}** options are passed to `.block`, and `.line`
- `return` **{String}**

**Example:**

```js
/*!
 * this multiline
 * block comment ('top banner')
 */

'use strict';

/**!
 * and this multiline
 * block comment
 */
var foo = function(/* and these single-line block comments */) {};

/**
 * and this multiline
 * block comment
 */
var bar = function(/* and these single-line block comments */) {};

// this single-line line comment
var baz = function () {
  // this multiline
  // line comment
  var some = true;
  //this
  var fafa = true; //and this
  // var also = 'that';
  var but = 'not'; //! that comment
};

// also this multiline
// line comment
var fun = false;
```

**Source:**

```js
var strip = module.exports = function(str, opts) {
  return str ? strip.block(strip.line(str, opts), opts) : '';
};
```

### strip.block(str[, opts])
Strip only block comments

- `str` **{String}** file content or string to strip to
- `opts` **{Object}** if `safe:true`, strip only that not starts with `/*!` or `/**!`
- `return` **{String}**

**Example:**

```js
/**
 * this multiline
 * block comment
 */
var bar = function(/* and these single-line block comment */) {
  /**
   * also that comment
   */
  var str = 'something'
};
```

**Source:**

```js
strip.block = function(str, opts) {
  opts = opts || {};
  var re = new RegExp(reBlock + reBlockEnd, 'gm');
  if(opts.safe) {
    re = new RegExp(reBlockIgnore + reBlockEnd, 'gm');
  }
  return str ? str.replace(re, '') : '';
};
```

### strip.line(str[, opts])
Strip only line comments

- `str` **{String}** file content or string to strip to
- `opts` **{Object}** if `safe:true`, strip all that not starts with `//!`
- `return` **{String}**

**Example:**

```js
// this single-line line comment
var baz = function () {
  // this multiline
  // line comment
  var some = true;
  //this
  var fafa = true; //and this
  // var also = 'that';
  var but = 'not'; //! that comment
};
```

**Source:**

```js
strip.line = function(str, opts) {
  opts = opts || {};
  var re = new RegExp(reLine, 'gm');
  if(opts.safe) {
    re = new RegExp(reLineIgnore, 'gm');
  }
  return str ? str.replace(re, '') : '';
};
```


## Tests

```bash
mocha -R spec
```


## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License
Copyright (c) 2014 Jon Schlinkert, contributors.
Released under the MIT license