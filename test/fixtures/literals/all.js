'use strict';

process.stdout.write('string literals: ');
console.dir({
  str0: '&apos;',
  str1: "&quot;",
  str2: ". // ' \\ . // ' \\ ."
});

var re = {};

//=> '/'
re.slash = '\\/';

//=> './'
re.dotSlash = '\\.\\/';

//=> '**'
re.all = '(?:(?!(?:\\/|^)\\.).)*?';

//=> ','
re.or = '|';

//=> '*'
re.star = '[^\\/]*';

//=> '*.'
re.starDot = '(?!\\.)(?=.)' + re.star + '?\\.';


function inclusiveRe(str) {
  return '^(?:' + str + ')$';
}

function exclusiveRe(str) {
  return '^(?!' + inclusiveRe(str) + ').*$';
}

/**
 * assemble.pages('foo/bar/*.baz');
 * assemble.pages('foo/**\/*.baz');
 * assemble.pages("foo/**\/*.baz");
 * assemble.partials("foo/**\/*.*");
 * assemble.partials("foo/**\/baz.js");
 *
 * @type {String}
 */

process.stdout.write('RegExp literals: ');
console.dir({
  regexp0: /I'm the easiest in Chomsky hierarchy!/,
});


var fails = ". // ' \\ . // ' \\ .";
var fails = ". // \''\" \\ . // ' \\ .";

/**
 * foo bar baz
 */

/* foo bar baz */
assemble.pages('foo/bar/*.baz');
assemble.pages('foo/**/*.baz');
assemble.pages("foo/**/*.baz");
assemble.partials("foo/**/*.*");
assemble.partials("foo/**/baz.js");


var config = {
  foo: 'bar',
  bar: '**/*.baz',
  vaz: '/**/*.*/**/*.js',
  fez: '/**/*.js'
};


/**
 * assemble.pages('foo/bar/*.baz');
 * assemble.pages('foo/**\/*.baz');
 * assemble.pages("foo/**\/*.baz");
 * assemble.partials("foo/**\/*.*");
 * assemble.partials("foo/**\/baz.js");
 *
 *
 * var config = {
 *   foo: 'bar',
 *   bar: '**\/*.baz'
 * };
 */
