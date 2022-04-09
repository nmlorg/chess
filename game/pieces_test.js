import {Board} from './board.js';


export function testKnightLegalmoves(U) {
  let board = new Board();
  board.load(`
. . .
. n .
. . .
`);
  let piece = board.rows[1][1].piece;
  let moves = Array.from(piece.legalmoves()).sort();
  U.assert(moves.join(',') == '');

  board.load(`
. . .
. n .
. . .
. . .
`);
  piece = board.rows[1][1].piece;
  moves = Array.from(piece.legalmoves()).sort();
  U.assert(moves.join(',') == 'a1,c1');

  board.load(`
. . . . .
. . . . .
. . n . .
. . . . .
. . . . .
`);
  piece = board.rows[2][2].piece;
  moves = Array.from(piece.legalmoves()).sort();
  U.assert(moves.join(',') == 'a2,a4,b1,b5,d1,d5,e2,e4');
}
