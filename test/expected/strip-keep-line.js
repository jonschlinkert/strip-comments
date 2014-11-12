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


var baz = function() {
  
  
  var some = true;
  
  var fafa = true; 
  
  var but = 'not'; //! that comment
};

var path = '/path/to/*/something/that/not/be/stripped.js';
var globstar = '/path/to/globstar/not/be/stripped/**/*.js';
