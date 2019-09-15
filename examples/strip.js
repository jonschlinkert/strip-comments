const strip = require('..');
const str = strip('const foo = "bar";/* me too */\n// this is a comment');
console.log(str);
// => 'const foo = "bar";\n'
