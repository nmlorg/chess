import * as assertmod from './assert.js';
import * as estree from './estree.js';


export function test_replacePieces(U) {
  let expr = '123';
  let pieces = [];
  let sub = assertmod.replacePieces(estree.buildTree(estree.tokenize(expr)), pieces);
  assert estree.visTree(sub) == `
Literal
  ├→ value: 123
  └→ raw: "123"
`;
  assert estree.visTree(pieces) == `
Array
`;

  expr = 'aa.bb.cc.dd';
  pieces = [];
  sub = assertmod.replacePieces(estree.buildTree(estree.tokenize(expr)), pieces);
  assert estree.visTree(sub) == `
SubstitutedExpression
  ├→ name: "__tmp3"
  ├→ full: "aa.bb.cc.dd"
  └→ local: "__tmp2.dd"
`;
  assert estree.visTree(pieces) == `
Array
  ├→ SubstitutedExpression
  │    ├→ name: "__tmp0"
  │    ├→ full: "aa"
  │    └→ local: "aa"
  ├→ SubstitutedExpression
  │    ├→ name: "__tmp1"
  │    ├→ full: "aa.bb"
  │    └→ local: "__tmp0.bb"
  ├→ SubstitutedExpression
  │    ├→ name: "__tmp2"
  │    ├→ full: "aa.bb.cc"
  │    └→ local: "__tmp1.cc"
  └→ SubstitutedExpression
       ├→ name: "__tmp3"
       ├→ full: "aa.bb.cc.dd"
       └→ local: "__tmp2.dd"
`;

  expr = 'foo(aa.bb, cc.dd) == 123';
  pieces = [];
  sub = assertmod.replacePieces(estree.buildTree(estree.tokenize(expr)), pieces);
  assert estree.visTree(sub) == `
SubstitutedExpression
  ├→ name: "__tmp6"
  ├→ full: "foo(aa.bb, cc.dd) == 123"
  └→ local: "__tmp5 == 123"
`;
  assert estree.visTree(pieces) == `
Array
  ├→ SubstitutedExpression
  │    ├→ name: "__tmp0"
  │    ├→ full: "foo"
  │    └→ local: "foo"
  ├→ SubstitutedExpression
  │    ├→ name: "__tmp1"
  │    ├→ full: "aa"
  │    └→ local: "aa"
  ├→ SubstitutedExpression
  │    ├→ name: "__tmp2"
  │    ├→ full: "aa.bb"
  │    └→ local: "__tmp1.bb"
  ├→ SubstitutedExpression
  │    ├→ name: "__tmp3"
  │    ├→ full: "cc"
  │    └→ local: "cc"
  ├→ SubstitutedExpression
  │    ├→ name: "__tmp4"
  │    ├→ full: "cc.dd"
  │    └→ local: "__tmp3.dd"
  ├→ SubstitutedExpression
  │    ├→ name: "__tmp5"
  │    ├→ full: "foo(aa.bb, cc.dd)"
  │    └→ local: "__tmp0(__tmp2, __tmp4)"
  └→ SubstitutedExpression
       ├→ name: "__tmp6"
       ├→ full: "foo(aa.bb, cc.dd) == 123"
       └→ local: "__tmp5 == 123"
`;

  expr = 'board.get().extra()';
  pieces = [];
  sub = assertmod.replacePieces(estree.buildTree(estree.tokenize(expr)), pieces);
  assert estree.visTree(sub) == `
SubstitutedExpression
  ├→ name: "__tmp4"
  ├→ full: "board.get().extra()"
  └→ local: "__tmp3()"
`;
  assert estree.visTree(pieces) == `
Array
  ├→ SubstitutedExpression
  │    ├→ name: "__tmp0"
  │    ├→ full: "board"
  │    └→ local: "board"
  ├→ SubstitutedExpression
  │    ├→ name: "__tmp1"
  │    ├→ full: "board.get"
  │    └→ local: "__tmp0.get.bind(__tmp0)"
  ├→ SubstitutedExpression
  │    ├→ name: "__tmp2"
  │    ├→ full: "board.get()"
  │    └→ local: "__tmp1()"
  ├→ SubstitutedExpression
  │    ├→ name: "__tmp3"
  │    ├→ full: "board.get().extra"
  │    └→ local: "__tmp2.extra.bind(__tmp2)"
  └→ SubstitutedExpression
       ├→ name: "__tmp4"
       ├→ full: "board.get().extra()"
       └→ local: "__tmp3()"
`;
}


export function test_fixAssert(U) {
  let expr = '123';
  assert assertmod.fixAssert(expr) == `\
if (!(123)) throw new U.AssertionError("123");`;

  expr = '123 == 234';
  assert assertmod.fixAssert(expr) == `\
let __tmp0 = 123 == 234; if (!(__tmp0)) throw new U.AssertionError("123 == 234" + '\\n  ' + "123 == 234" + ': ' + U.format(__tmp0));`;

  expr = 'board == 123';
  assert assertmod.fixAssert(expr) == `\
let __tmp0 = board, __tmp1 = __tmp0 == 123; if (!(__tmp1)) throw new U.AssertionError("board == 123" + '\\n  ' + "board" + ': ' + U.format(__tmp0) + '\\n  ' + "board == 123" + ': ' + U.format(__tmp1));`;

  expr = "board.get('a1', foo()).piece.moves == 123";
  assert assertmod.fixAssert(expr) == `\
let __tmp0 = board, __tmp1 = __tmp0.get.bind(__tmp0), __tmp2 = foo, __tmp3 = __tmp2(), __tmp4 = __tmp1('a1', __tmp3), __tmp5 = __tmp4.piece, __tmp6 = __tmp5.moves, __tmp7 = __tmp6 == 123; if (!(__tmp7)) throw new U.AssertionError("board.get('a1', foo()).piece.moves == 123" + '\\n  ' + "board" + ': ' + U.format(__tmp0) + '\\n  ' + "board.get" + ': ' + U.format(__tmp1) + '\\n  ' + "foo" + ': ' + U.format(__tmp2) + '\\n  ' + "foo()" + ': ' + U.format(__tmp3) + '\\n  ' + "board.get('a1', foo())" + ': ' + U.format(__tmp4) + '\\n  ' + "board.get('a1', foo()).piece" + ': ' + U.format(__tmp5) + '\\n  ' + "board.get('a1', foo()).piece.moves" + ': ' + U.format(__tmp6) + '\\n  ' + "board.get('a1', foo()).piece.moves == 123" + ': ' + U.format(__tmp7));`;
}
