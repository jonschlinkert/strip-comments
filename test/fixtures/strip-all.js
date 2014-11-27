/*!
 * BANNER1
 * strip this multiline
 * block comment
 */
'use strict';

/**!
 * ABC
 * and this multiline
 * block comment
 */
var foo = function(/* and these single-line block comments */) {};

/**
 * DEF
 * and this
 * multiline block
 * comment
 */
var bar = function(/* and this */) {};

// this single-line line comment
var baz = function() {
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
var path = '/path/to/*/something/that/not/be/stripped.js';
var globstar = '/path/to/globstar/not/be/stripped/**/*.js';
