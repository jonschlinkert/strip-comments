const strip = require('..');
const str = strip('const foo = "bar";// this is a comment\n /* me too */');
console.log(str);
// => 'const foo = "bar";\n'
