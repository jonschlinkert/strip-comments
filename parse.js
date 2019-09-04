'use strict';

const isObject = val => {
  return val !== null && typeof val === 'object';
};

class Node {
  constructor(node) {
    this.type = node.type;
    if (node.value) this.value = node.value;
    if (node.match) this.match = node.match;
    this.newline = node.newline || '';
  }
  get protected() {
    return !!this.match && this.match[1] === '!';
  }
}

class Block extends Node {
  constructor(node) {
    super(node);
    this.nodes = node.nodes || [];
  }
  push(node) {
    this.nodes.push(node);
  }
  get protected() {
    return this.nodes.length > 0 && this.nodes[0].protected === true;
  }
}

const parse = (input, options = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected input to be a string');
  }

  let ast = new Block({ type: 'root', nodes: [] });
  let remaining = input;
  let stack = [ast];
  let block = ast;
  let token;
  let prev;

  const eos = () => remaining === '';

  const consume = (value = remaining[0] || '') => {
    remaining = remaining.slice(value.length);
    return value;
  };

  const scan = (regex, type = 'text') => {
    let match = regex.exec(remaining);
    if (match) {
      consume(match[0]);
      return { type, value: match[0], match };
    }
  };

  const push = node => {
    if (prev && prev.type === 'text' && node.type === 'text') {
      prev.value += node.value;
      return;
    }

    block.push(node);

    if (node.nodes) {
      stack.push(node);
      block = node;
    }

    prev = node;
  };

  const pop = () => {
    if (block.type === 'root') {
      throw new SyntaxError('Unclosed block comment');
    }
    stack.pop();
    block = stack[stack.length - 1];
  };

  while (!eos()) {
    // escaped characters
    if ((token = scan(/^\\./, 'text'))) {
      push(new Node(token));
      continue;
    }

    // quoted strings
    if (block.type !== 'block') {
      if ((token = scan(/^(['"`])((?:\\.|[^\1])*?)(\1)/, 'text'))) {
        push(new Node(token));
        continue;
      }
    }

    // newlines
    if ((token = scan(/^\r?\n/, 'newline'))) {
      push(new Node(token));
      continue;
    }

    if (options.block) {
      if ((token = scan(/^\/\*\*?(!?)/, 'open'))) {
        push(new Block({ type: 'block' }));
        push(new Node(token));
        continue;
      }
    }

    if (block.type === 'block' && options.block) {
      if ((token = scan(/^\*\/(\n?)/, 'close'))) {
        token.newline = token.match[1] || '';
        push(new Node(token));
        pop();
        continue;
      }
    }

    if (block.type !== 'block' && options.line) {
      if ((token = scan(/^\/\/(!?).*/, 'line'))) {
        push(new Node(token));
        continue;
      }
    }

    push(new Node(scan(/^([^\n*/\\"'`]+|.)/)));
  }

  return ast;
};

const compile = (ast, options = {}) => {
  const keepProtected = options.safe === true || options.keepProtected === true;
  let firstSeen = false;

  if (!isObject(ast)) {
    ast = parse(ast, options);
  }

  const walk = (node, parent) => {
    let output = '';
    let value;
    let lines;

    for (const child of node.nodes) {
      switch (child.type) {
        case 'block':
          if (options.first && firstSeen === true) {
            output += walk(child, node);
            break;
          }

          if (options.preserveNewlines === true) {
            value = walk(child, node);
            lines = value.split('\n');
            output += '\n'.repeat(lines.length - 1);
          }

          if (keepProtected === true && child.protected === true) {
            output += walk(child, node);
            break;
          }

          firstSeen = true;
          break;
        case 'line':
          if (options.first && firstSeen === true) {
            output += child.value;
            break;
          }

          if (keepProtected === true && child.protected === true) {
            output += child.value;
          }

          firstSeen = true;
          break;
        case 'open':
        case 'close':
        case 'text':
        case 'newline':
        default: {
          output += child.value || '';
          break;
        }
      }
    }

    return output;
  };

  return walk(ast);
};

module.exports = { parse, compile };
