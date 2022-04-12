import {Board} from './board.js';


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
