
'use stric';

//line comment 1
var reBlock = /\/\*(?!\/)(.|[\r\n]|\n)+?\*\/\n?\n?/gm
var reBlockIgnore = /\/\*(?!(\*?\/|\*?\!))(.|[\r\n]|\n)+?\*\/\n?\n?/gm
var reLine = /(^|[^\S\n])(?:\/\/)([\s\S]+?)$/gm;
var reLineIgnore = /(^|[^\S\n])(?:\/\/[^!])([\s\S]+?)$/gm;



//line comment 2
var strip = module.exports = function(str, opts) {
  return str ? strip.block(strip.line(str, opts), opts) : '';
};



//line
//comment 3
strip.block = function(str, opts) {
  opts = opts || {};
  var re = reBlock //new RegExp(reBlock + reBlockEnd, 'gm');
  if(opts.safe) {
    re = reBlockIgnore //new RegExp(reBlockIgnore + reBlockEnd, 'gm');
  }
  return str ? str.replace(re, '') : '';
};



//line
//comment 4
strip.line = function(str, opts) {
  opts = opts || {};
  var re = reLine;
  if(opts.safe) {
    re = reLineIgnore;
  }
  return str ? str.replace(re, '') : '';
};
