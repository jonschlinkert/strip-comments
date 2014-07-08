/*!
 * strip this multiline
 * block comment
 */
'use strict';

/**!
 * and this multiline
 * block comment
 */
var foo = function(/* and these single-line block comment */) {};

/**
 * and this
 * multiline block
 * comment
 */
var bar = function(/* and that */) {};

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