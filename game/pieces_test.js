import {Board} from './board.js';


export function test_Bishop_legalmoves(U) {
  let board = new Board();
  board.load(`
. . . . .
. . . . .
. . b . .
. . . . .
. . . . .
`);
  let piece = board.get('c3').piece;
  let moves = Array.from(piece.legalmoves()).sort();
  U.assert(moves.join(',') == 'a1,a5,b2,b4,d2,d4,e1,e5');

  board.load(`
. . b . .
. r . R .
. . . . .
`);
  piece = board.get('c3').piece;
  moves = Array.from(piece.legalmoves()).sort();
  U.assert(moves.join(',') == 'd2');
}


export function test_Knight_legalmoves(U) {
  let board = new Board();
  board.load(`
. . .
. n .
. . .
`);
  let piece = board.get('b2').piece;
  let moves = Array.from(piece.legalmoves()).sort();
  U.assert(moves.join(',') == '');

  board.load(`
. . .
. n .
. . .
. . .
`);
  piece = board.get('b3').piece;
  moves = Array.from(piece.legalmoves()).sort();
  U.assert(moves.join(',') == 'a1,c1');

  board.load(`
. . . . .
. . . . .
. . n . .
. . . . .
. . . . .
`);
  piece = board.get('c3').piece;
  moves = Array.from(piece.legalmoves()).sort();
  U.assert(moves.join(',') == 'a2,a4,b1,b5,d1,d5,e2,e4');
}


export function test_Pawn_legalmoves(U) {
  let board = new Board();
  board.load(`
. . .
. p .
. . .
`);
  let piece = board.get('b2').piece;
  let moves = Array.from(piece.legalmoves()).sort();
  U.assert(moves.join(',') == 'b1');

  board.load(`
. . .
. P .
. . .
`);
  piece = board.get('b2').piece;
  moves = Array.from(piece.legalmoves()).sort();
  U.assert(moves.join(',') == 'b3');

  board.load(`
. . .
. . .
. P .
. . .
`);
  piece = board.get('b2').piece;
  moves = Array.from(piece.legalmoves()).sort();
  U.assert(moves.join(',') == 'b3,b4');

  board.load(`
. . .
r . R
. P .
. . .
`);
  piece = board.get('b2').piece;
  moves = Array.from(piece.legalmoves()).sort();
  U.assert(moves.join(',') == 'a3,b3,b4');

  board.load(`
. . .
r R .
. P .
. . .
`);
  piece = board.get('b2').piece;
  moves = Array.from(piece.legalmoves()).sort();
  U.assert(moves.join(',') == 'a3');
}
