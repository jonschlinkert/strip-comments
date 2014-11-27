'use strict';

process.stdout.write('string literals: ');
console.dir({
  str0: '&apos;',
  str1: "&quot;",
  str2: ". // ' \\ . // ' \\ ."
});
