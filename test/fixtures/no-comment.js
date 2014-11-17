'use strict';

process.stdout.write('string literals: ');
console.dir({
  str0: '&apos;',
  str1: "&quot;",
  str2: ". // ' \\ . // ' \\ .",
});

process.stdout.write('RegExp literals: ');
console.dir({
  regexp0: /I'm the easiest in Chomsky hierarchy!/,
});
