export function tokenize(expr) {
  let tokens = expr.trim().split(/([=!<>]?=|"[^"]*"|'[^']*'|\s+|\W)/);
  for (let i = tokens.length - 1; i >= 0; i--)
    if (tokens[i].trim() == '')
      tokens.splice(i, 1);
  return tokens;
}


export class Node {}


class BinaryExpression extends Node {
  constructor(left, operator, right) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
}


class CallExpression extends Node {
  constructor(callee, arguments_) {
    super();
    this.callee = callee;
    this.arguments = arguments_;
  }
}


class Identifier extends Node {
  constructor(name) {
    super();
    this.name = name;
  }
}


class Literal extends Node {
  constructor(value, raw) {
    super();
    this.value = value;
    this.raw = raw;
  }
}


class MemberExpression extends Node {
  constructor(object, property) {
    super();
    this.object = object;
    this.property = property;
  }
}


export function buildTree(tokens) {
  let expr = null;
  while (tokens.length && (tokens[0] != ',') && (tokens[0] != ')')) {
    let next = tokens.shift();
    if (next == '==')
      expr = new BinaryExpression(expr, next, buildTree(tokens));
    else if (next == '.') {
      next = tokens.shift();
      // MemberExpression.property is supposed to be an Identifier, but is treated as a Literal.
      expr = new MemberExpression(expr, new Literal(next, next));
    } else if (next == '(') {
      let args = [];
      while (tokens.length) {
        if (tokens[0] == ')') {
          tokens.shift();
          break;
        }
        args.push(buildTree(tokens));
        if (tokens[0] == ',') {
          tokens.shift();
          continue;
        }
      }
      expr = new CallExpression(expr, args);
    } else if (!expr) {
      let raw = next;
      if ((next.length > 1) && (next[0] == "'") && (next[next.length - 1] == "'"))
        next = `"${next.substr(1, next.length - 2).replace(/"/g, '\\"')}"`;
      try {
        expr = new Literal(JSON.parse(next), raw);
      } catch {
        expr = new Identifier(raw);
      }
    } else {
      tokens.unshift(next);
      break;
    }
  }
  return expr;
}
