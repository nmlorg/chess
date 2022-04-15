import * as estree from './estree.js';


export function test_tokenize(U) {
  U.assert(estree.tokenize('').join('_') == '');
  U.assert(estree.tokenize('aa').join('_') == 'aa');
  U.assert(estree.tokenize('aa.bb').join('_') == 'aa_._bb');
  U.assert(estree.tokenize('  aa.bb(  cc  () )  ').join('_') == 'aa_._bb_(_cc_(_)_)');
}


function* flattenTree(node) {
  if (Array.isArray(node)) {
    if (!node.length) {
      yield '[]';
      return;
    }
    yield '[';
    for (let v of node) {
      let lines = Array.from(flattenTree(v));
      if (lines.length == 1) {
        yield `    ${lines[0]},`;
        continue;
      }
      for (let j = 0; j < lines.length - 1; j++)
        yield `    ${lines[j]}`;
      yield `    ${lines[lines.length - 1]},`;
    }
    yield ']';
    return;
  }
  if (!(node instanceof estree.Node)) {
    yield JSON.stringify(node);
    return;
  }
  yield `${node.constructor.name}(`;
  let children = Object.entries(node);
  for (let i = 0; i < children.length; i++) {
    let ending = i < children.length - 1 ? ',' : ')';
    let [k, v] = children[i];
    let lines = Array.from(flattenTree(v));
    if (lines.length == 1) {
      yield `    ${k}=${lines[0]}${ending}`;
      continue;
    }
    yield `    ${k}=${lines[0]}`;
    for (let j = 1; j < lines.length - 1; j++)
      yield `    ${lines[j]}`;
    yield `    ${lines[lines.length - 1]}${ending}`;
  }
}


export function test_buildTree(U) {
  let expr = 'aa';
  let tokens = estree.tokenize(expr);
  let tree = estree.buildTree(tokens);
  U.assert(Array.from(flattenTree(tree)).join('\n') == `\
Identifier(
    name="aa")`);

  expr = 'aa == bb';
  tokens = estree.tokenize(expr);
  tree = estree.buildTree(tokens);
  U.assert(Array.from(flattenTree(tree)).join('\n') == `\
BinaryExpression(
    left=Identifier(
        name="aa"),
    operator="==",
    right=Identifier(
        name="bb"))`);

  expr = 'aa.bb';
  tokens = estree.tokenize(expr);
  tree = estree.buildTree(tokens);
  U.assert(Array.from(flattenTree(tree)).join('\n') == `\
MemberExpression(
    object=Identifier(
        name="aa"),
    property=Identifier(
        name="bb"))`);

  expr = 'aa.bb.cc';
  tokens = estree.tokenize(expr);
  tree = estree.buildTree(tokens);
  U.assert(Array.from(flattenTree(tree)).join('\n') == `\
MemberExpression(
    object=MemberExpression(
        object=Identifier(
            name="aa"),
        property=Identifier(
            name="bb")),
    property=Identifier(
        name="cc"))`);

  expr = 'aa()';
  tokens = estree.tokenize(expr);
  tree = estree.buildTree(tokens);
  U.assert(Array.from(flattenTree(tree)).join('\n') == `\
CallExpression(
    callee=Identifier(
        name="aa"),
    arguments=[])`);

  expr = 'aa(bb, cc)';
  tokens = estree.tokenize(expr);
  tree = estree.buildTree(tokens);
  U.assert(Array.from(flattenTree(tree)).join('\n') == `\
CallExpression(
    callee=Identifier(
        name="aa"),
    arguments=[
        Identifier(
            name="bb"),
        Identifier(
            name="cc"),
    ])`);

  expr = "board.get('a1', foo()).piece.moves == 123";
  tokens = estree.tokenize(expr);
  tree = estree.buildTree(tokens);
  U.assert(Array.from(flattenTree(tree)).join('\n') == `\
BinaryExpression(
    left=MemberExpression(
        object=MemberExpression(
            object=CallExpression(
                callee=MemberExpression(
                    object=Identifier(
                        name="board"),
                    property=Identifier(
                        name="get")),
                arguments=[
                    Identifier(
                        name="'a1'"),
                    CallExpression(
                        callee=Identifier(
                            name="foo"),
                        arguments=[]),
                ]),
            property=Identifier(
                name="piece")),
        property=Identifier(
            name="moves")),
    operator="==",
    right=Identifier(
        name="123"))`);
}
