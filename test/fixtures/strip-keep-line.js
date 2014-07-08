/**
 * this block comment
 * will not be striped
 */

'use strict';

//! and this multiline
//! block comment
var foo = function(/* and these single-line block comment */) {};

/**
 * and this
 * multiline block
 * comment
 */
var bar = function(/* and that */) {};

//will be removed
var baz = function() {
  // this multiline
  // line comment
  var some = true;
  // will be
  var fafa = true; 
  // var removed = 'yes';
  var but = 'not'; //! that comment
};