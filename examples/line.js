const strip = require('..');
const str = strip.line('const foo = "bar";// this is a comment\n /* me too */');
console.log(str);
// => 'const foo = "bar";\n /* me too */'
