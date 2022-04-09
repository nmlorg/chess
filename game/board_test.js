import {Board, numToLetters_} from './board.js';


export function test_Board_copy(U) {
  let board1 = new Board();
  let board2 = board1.copy();
  U.assert(board1.serialize() == '');
  U.assert(board2.serialize() == '');

  // Verify rows is independent.
  board1.load('r .\n. N');
  U.assert(board1.serialize() == 'r .\n. N');
  U.assert(board2.serialize() == '');

  board2 = board1.copy();
  U.assert(board1.serialize() == 'r .\n. N');
  U.assert(board2.serialize() == 'r .\n. N');

  // Verify the Piece is independent.
  board1.rows[0][0].piece.moves = 1;
  U.assert(board1.serialize() == 'r1 .\n.  N');
  U.assert(board2.serialize() == 'r .\n. N');

  // Verify the Square is independent.
  board1.rows[0][0].piece = null;
  U.assert(board1.serialize() == '. .\n. N');
  U.assert(board2.serialize() == 'r .\n. N');
}


export function test_Board_legalMoves(U) {
  let board = new Board();
  let moves = Array.from(board.legalmoves(true), move => move.join('-')).sort();
  U.assert(moves.join(',') == '');

  board.reset();
  moves = Array.from(board.legalmoves(true), move => move.join('-')).sort();
  U.assert(moves.join(',') == `\
a2-a3,a2-a4,\
b1-a3,b1-c3,\
b2-b3,b2-b4,\
c2-c3,c2-c4,\
d2-d3,d2-d4,\
e2-e3,e2-e4,\
f2-f3,f2-f4,\
g1-f3,g1-h3,\
g2-g3,g2-g4,\
h2-h3,h2-h4`);
}


export function test_Board_load(U) {
  let board = new Board();
  U.assert(board.serialize() == '');

  board.load('');
  U.assert(board.serialize() == '');

  board.load('P');
  U.assert(board.rows.length == 1);
  U.assert(board.rows[0].length == 1);
  U.assert(board.rows[0][0].piece.constructor.name == 'Pawn');

  board.load('r .\n. N');
  U.assert(board.rows.length == 2);
  U.assert(board.rows[0].length == 2);
  U.assert(board.rows[1].length == 2);
  U.assert(board.rows[0][0].piece.constructor.name == 'Rook');
  U.assert(!board.rows[0][1].piece);
  U.assert(!board.rows[1][0].piece);
  U.assert(board.rows[1][1].piece.constructor.name == 'Knight');
}


export function test_Board_reset(U) {
  let board = new Board();
  U.assert(board.rows instanceof Array);
  U.assert(board.rows.length == 0);
  board.reset();
  U.assert(board.rows.length == 8);
}


export function test_Board_serialize(U) {
  let board = new Board();
  U.assert(board.serialize() == '');

  board.reset();
  U.assert(board.serialize() == `\
r n b q k b n r
p p p p p p p p
. . . . . . . .
. . . . . . . .
. . . . . . . .
. . . . . . . .
P P P P P P P P
R N B Q K B N R`);

  board.rows[6][1].piece.moves = 1;
  U.assert(board.serialize() == `\
r  n  b  q  k  b  n  r
p  p  p  p  p  p  p  p
.  .  .  .  .  .  .  .
.  .  .  .  .  .  .  .
.  .  .  .  .  .  .  .
.  .  .  .  .  .  .  .
P  P1 P  P  P  P  P  P
R  N  B  Q  K  B  N  R`);

  board.rows[0][5].piece.moves = 10;
  U.assert(board.serialize() == `\
r   n   b   q   k   b10 n   r
p   p   p   p   p   p   p   p
.   .   .   .   .   .   .   .
.   .   .   .   .   .   .   .
.   .   .   .   .   .   .   .
.   .   .   .   .   .   .   .
P   P1  P   P   P   P   P   P
R   N   B   Q   K   B   N   R`);
}


export function test_numToLetters_(U) {
  U.assert(numToLetters_(0) == 'a');
  U.assert(numToLetters_(1) == 'b');
  U.assert(numToLetters_(25) == 'z');
  U.assert(numToLetters_(26) == 'aa');
  U.assert(numToLetters_(27) == 'ab');
  U.assert(numToLetters_(60) == 'bi');
  U.assert(numToLetters_(999) == 'all');
}


export function test_Square_name(U) {
  let board = new Board();
  board.reset();
  U.assert(board.rows[0][0].name, 'a8');
  U.assert(board.rows[7][0].name, 'a1');
  U.assert(board.rows[7][7].name, 'h1');
}
