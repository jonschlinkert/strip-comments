var re = {};


re.slash = '\\/';


re.dotSlash = '\\.\\/';


re.all = '(?:(?!(?:\\/|^)\\.).)*?';


re.or = '|';


re.star = '[^\\/]*';


re.starDot = '(?!\\.)(?=.)' + re.star + '?\\.';


function inclusiveRe(str) {
  return '^(?:' + str + ')$';
}

function exclusiveRe(str) {
  return '^(?!' + inclusiveRe(str) + ').*$';
}


var fails = ". // ' \\ . // ' \\ .";
var fails = ". // \''\" \\ . // ' \\ .";




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