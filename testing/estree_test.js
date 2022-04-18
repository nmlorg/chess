import * as estree from './estree.js';


export function test_tokenize(U) {
  assert estree.tokenize('').join('_') == '';
  assert estree.tokenize('aa').join('_') == 'aa';
  assert estree.tokenize('aa.bb').join('_') == 'aa_._bb';
  assert estree.tokenize('  aa.bb(  cc  () )  ').join('_') == 'aa_._bb_(_cc_(_)_)';
  assert estree.tokenize('func("double q string")').join('_') == 'func_(_"double q string"_)';
  assert estree.tokenize('func(`template string`)').join('_') == 'func_(_`template string`_)';
}


export function test_buildTree(U) {
  let expr = 'aa';
  let tokens = estree.tokenize(expr);
  let tree = estree.buildTree(tokens);
  assert estree.visTree(tree) == `
Identifier
  └→ name: "aa"
`;

  expr = 'aa == bb';
  tokens = estree.tokenize(expr);
  tree = estree.buildTree(tokens);
  assert estree.visTree(tree) == `
BinaryExpression
  ├→ left: Identifier
  │    └→ name: "aa"
  ├→ operator: "=="
  └→ right: Identifier
       └→ name: "bb"
`;

  expr = 'aa.bb';
  tokens = estree.tokenize(expr);
  tree = estree.buildTree(tokens);
  assert estree.visTree(tree) == `
MemberExpression
  ├→ object: Identifier
  │    └→ name: "aa"
  └→ property: Literal
       ├→ value: "bb"
       └→ raw: "bb"
`;

  expr = 'aa.bb.cc';
  tokens = estree.tokenize(expr);
  tree = estree.buildTree(tokens);
  assert estree.visTree(tree) == `
MemberExpression
  ├→ object: MemberExpression
  │    ├→ object: Identifier
  │    │    └→ name: "aa"
  │    └→ property: Literal
  │         ├→ value: "bb"
  │         └→ raw: "bb"
  └→ property: Literal
       ├→ value: "cc"
       └→ raw: "cc"
`;

  expr = 'aa()';
  tokens = estree.tokenize(expr);
  tree = estree.buildTree(tokens);
  assert estree.visTree(tree) == `
CallExpression
  ├→ callee: Identifier
  │    └→ name: "aa"
  └→ arguments: Array
`;

  expr = 'aa(bb, cc)';
  tokens = estree.tokenize(expr);
  tree = estree.buildTree(tokens);
  assert estree.visTree(tree) == `
CallExpression
  ├→ callee: Identifier
  │    └→ name: "aa"
  └→ arguments: Array
       ├→ Identifier
       │    └→ name: "bb"
       └→ Identifier
            └→ name: "cc"
`;

  expr = "board.get('a1', foo()).piece.moves == 123";
  tokens = estree.tokenize(expr);
  tree = estree.buildTree(tokens);
  assert estree.visTree(tree) == `
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
       └→ raw: "123"
`;
}
