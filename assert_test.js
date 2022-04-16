import * as assertmod from './assert.js';
import * as estree from './estree.js';
import {flattenTree} from './estree_test.js';


export function test_replacePieces(U) {
  let expr = '123';
  let pieces = [];
  let sub = assertmod.replacePieces(estree.buildTree(estree.tokenize(expr)), pieces);
  U.assert(flattenTree(sub) == `
Literal
  ├→ value: 123
  └→ raw: "123"
`);
  U.assert(flattenTree(pieces) == `
Array
`);

  expr = 'aa.bb.cc.dd';
  pieces = [];
  sub = assertmod.replacePieces(estree.buildTree(estree.tokenize(expr)), pieces);
  U.assert(flattenTree(sub) == `
SubstitutedExpression
  ├→ name: "__tmp3"
  ├→ full: "aa.bb.cc.dd"
  └→ local: "__tmp2.dd"
`);
  U.assert(flattenTree(pieces) == `
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
`);

  expr = 'foo(aa.bb, cc.dd) == 123';
  pieces = [];
  sub = assertmod.replacePieces(estree.buildTree(estree.tokenize(expr)), pieces);
  U.assert(flattenTree(sub) == `
SubstitutedExpression
  ├→ name: "__tmp6"
  ├→ full: "foo(aa.bb, cc.dd) == 123"
  └→ local: "__tmp5 == 123"
`);
  U.assert(flattenTree(pieces) == `
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
`);

  expr = 'board.get().extra()';
  pieces = [];
  sub = assertmod.replacePieces(estree.buildTree(estree.tokenize(expr)), pieces);
  U.assert(flattenTree(sub) == `
SubstitutedExpression
  ├→ name: "__tmp4"
  ├→ full: "board.get().extra()"
  └→ local: "__tmp3()"
`);
  U.assert(flattenTree(pieces) == `
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
`);
}
