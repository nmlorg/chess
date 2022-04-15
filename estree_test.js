import * as estree from './estree.js';


export function test_tokenize(U) {
  U.assert(estree.tokenize('').join('_') == '');
  U.assert(estree.tokenize('aa').join('_') == 'aa');
  U.assert(estree.tokenize('aa.bb').join('_') == 'aa_._bb');
  U.assert(estree.tokenize('  aa.bb(  cc  () )  ').join('_') == 'aa_._bb_(_cc_(_)_)');
}


function* flattenTree(node) {
  if (Array.isArray(node)) {
    yield 'Array';
    for (let i = 0; i < node.length; i++) {
      let last = i == node.length - 1;
      let lines = Array.from(flattenTree(node[i]));
      yield `  ${last ? '\u2514' : '\u251c'}\u2192 ${lines[0]}`;
      for (let j = 1; j < lines.length; j++)
        yield `  ${last ? ' ' : '\u2502'}  ${lines[j]}`;
    }
    return;
  }
  if (!(node instanceof estree.Node)) {
    yield JSON.stringify(node);
    return;
  }
  yield `${node.constructor.name}`;
  let children = Object.entries(node);
  for (let i = 0; i < children.length; i++) {
    let last = i == children.length - 1;
    let [k, v] = children[i];
    let lines = Array.from(flattenTree(v));
    yield `  ${last ? '\u2514' : '\u251c'}\u2192 ${k}: ${lines[0]}`;
    for (let j = 1; j < lines.length; j++)
      yield `  ${last ? ' ' : '\u2502'}  ${lines[j]}`;
  }
}


export function test_buildTree(U) {
  let expr = 'aa';
  let tokens = estree.tokenize(expr);
  let tree = estree.buildTree(tokens);
  U.assert(Array.from(flattenTree(tree)).join('\n') == `\
Identifier
  └→ name: "aa"`);

  expr = 'aa == bb';
  tokens = estree.tokenize(expr);
  tree = estree.buildTree(tokens);
  U.assert(Array.from(flattenTree(tree)).join('\n') == `\
BinaryExpression
  ├→ left: Identifier
  │    └→ name: "aa"
  ├→ operator: "=="
  └→ right: Identifier
       └→ name: "bb"`);

  expr = 'aa.bb';
  tokens = estree.tokenize(expr);
  tree = estree.buildTree(tokens);
  U.assert(Array.from(flattenTree(tree)).join('\n') == `\
MemberExpression
  ├→ object: Identifier
  │    └→ name: "aa"
  └→ property: Literal
       ├→ value: "bb"
       └→ raw: "bb"`);

  expr = 'aa.bb.cc';
  tokens = estree.tokenize(expr);
  tree = estree.buildTree(tokens);
  U.assert(Array.from(flattenTree(tree)).join('\n') == `\
MemberExpression
  ├→ object: MemberExpression
  │    ├→ object: Identifier
  │    │    └→ name: "aa"
  │    └→ property: Literal
  │         ├→ value: "bb"
  │         └→ raw: "bb"
  └→ property: Literal
       ├→ value: "cc"
       └→ raw: "cc"`);

  expr = 'aa()';
  tokens = estree.tokenize(expr);
  tree = estree.buildTree(tokens);
  U.assert(Array.from(flattenTree(tree)).join('\n') == `\
CallExpression
  ├→ callee: Identifier
  │    └→ name: "aa"
  └→ arguments: Array`);

  expr = 'aa(bb, cc)';
  tokens = estree.tokenize(expr);
  tree = estree.buildTree(tokens);
  U.assert(Array.from(flattenTree(tree)).join('\n') == `\
CallExpression
  ├→ callee: Identifier
  │    └→ name: "aa"
  └→ arguments: Array
       ├→ Identifier
       │    └→ name: "bb"
       └→ Identifier
            └→ name: "cc"`);

  expr = "board.get('a1', foo()).piece.moves == 123";
  tokens = estree.tokenize(expr);
  tree = estree.buildTree(tokens);
  U.assert(Array.from(flattenTree(tree)).join('\n') == `\
BinaryExpression
  ├→ left: MemberExpression
  │    ├→ object: MemberExpression
  │    │    ├→ object: CallExpression
  │    │    │    ├→ callee: MemberExpression
  │    │    │    │    ├→ object: Identifier
  │    │    │    │    │    └→ name: "board"
  │    │    │    │    └→ property: Literal
  │    │    │    │         ├→ value: "get"
  │    │    │    │         └→ raw: "get"
  │    │    │    └→ arguments: Array
  │    │    │         ├→ Literal
  │    │    │         │    ├→ value: "a1"
  │    │    │         │    └→ raw: "'a1'"
  │    │    │         └→ CallExpression
  │    │    │              ├→ callee: Identifier
  │    │    │              │    └→ name: "foo"
  │    │    │              └→ arguments: Array
  │    │    └→ property: Literal
  │    │         ├→ value: "piece"
  │    │         └→ raw: "piece"
  │    └→ property: Literal
  │         ├→ value: "moves"
  │         └→ raw: "moves"
  ├→ operator: "=="
  └→ right: Literal
       ├→ value: 123
       └→ raw: "123"`);
}
