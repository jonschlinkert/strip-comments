'use stric';


var reBlock = /\/\*(?!\/)(.|[\r\n]|\n)+?\*\/\n?\n?/gm
var reBlockIgnore = /\/\*(?!(\*?\/|\*?\!))(.|[\r\n]|\n)+?\*\/\n?\n?/gm
var reLine = /(^|[^\S\n])(?:\/\/)([\s\S]+?)$/gm;
var reLineIgnore = /(^|[^\S\n])(?:\/\/[^!])([\s\S]+?)$/gm;



var strip = module.exports = function(str, opts) {
  return str ? strip.block(strip.line(str, opts), opts) : '';
};




strip.block = function(str, opts) {
  opts = opts || {};
  var re = reBlock
  if(opts.safe) {
    re = reBlockIgnore
  }
  return str ? str.replace(re, '') : '';
};




strip.line = function(str, opts) {
  opts = opts || {};
  var re = reLine;
  if(opts.safe) {
    re = reLineIgnore;
  }
  return str ? str.replace(re, '') : '';
};
