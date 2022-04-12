import {Board, Position} from './board.js';


export function test_Board_copy(U) {
  let board1 = new Board();
  let board2 = board1.copy();
  U.assert(board1.serialize() == '');
  U.assert(board2.serialize() == '');

  // Verify Board.rows is independent.
  board1.load('r .\n. N');
  U.assert(board1.serialize() == 'r .\n. N');
  U.assert(board2.serialize() == '');

  board2 = board1.copy();
  U.assert(board1.serialize() == 'r .\n. N');
  U.assert(board2.serialize() == 'r .\n. N');

  // Verify the Piece is independent.
  board1.get('a2').piece.moves = 1;
  U.assert(board1.serialize() == 'r1 .\n.  N');
  U.assert(board2.serialize() == 'r .\n. N');

  // Verify the Square is independent.
  board1.get('a2').piece = null;
  U.assert(board1.serialize() == '. .\n. N');
  U.assert(board2.serialize() == 'r .\n. N');
}


export function test_Board_legalmoves(U) {
  let board = new Board();
  let moves = Array.from(board.legalmoves(0), move => move.join('-')).sort();
  U.assert(moves.join(',') == '');

  board.reset();
  moves = Array.from(board.legalmoves(0), move => move.join('-')).sort();
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
  U.assert(board.get('a1').piece.constructor.name == 'Pawn');

  board.load('r .\n. N');
  let a1 = board.get('a1');
  let a2 = board.get('a2');
  let b1 = board.get('b1');
  let b2 = board.get('b2');
  U.assert(a1.piece == null);
  U.assert(a1.down == null);
  U.assert(a1.left == null);
  U.assert(a1.right == b1);
  U.assert(a1.up == a2);

  U.assert(a2.piece.constructor.name == 'Rook');
  U.assert(a2.piece.square == a2);
  U.assert(a2.down == a1);
  U.assert(a2.left == null);
  U.assert(a2.right == b2);
  U.assert(a2.up == null);

  U.assert(b1.piece.constructor.name == 'Knight');
  U.assert(b1.piece.square == b1);
  U.assert(b1.down == null);
  U.assert(b1.left == a1);
  U.assert(b1.right == null);
  U.assert(b1.up == b2);

  U.assert(b2.piece == null);
  U.assert(b2.down == b1);
  U.assert(b2.left == a2);
  U.assert(b2.right == null);
  U.assert(b2.up == null);
}


export function test_Board_move(U) {
  let board = new Board();
  board.load('B .\nr P');
  U.assert(board.serialize() == 'B .\nr P');

  board.move('a1', 'a2');
  U.assert(board.serialize() == 'r1 .\n.  P');

  board.move('b1', 'a2');
  U.assert(board.serialize() == 'P1 .\n.  .');
}


export function test_Board_reset(U) {
  let board = new Board();
  U.assert(board.rows instanceof Array);
  U.assert(board.rows.length == 0);
  board.reset();
  U.assert(board.rows.length == 8);
  U.assert(board.rows[0].length == 8);
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

  board.get('b2').piece.moves = 1;
  U.assert(board.serialize() == `\
r  n  b  q  k  b  n  r
p  p  p  p  p  p  p  p
.  .  .  .  .  .  .  .
.  .  .  .  .  .  .  .
.  .  .  .  .  .  .  .
.  .  .  .  .  .  .  .
P  P1 P  P  P  P  P  P
R  N  B  Q  K  B  N  R`);

  board.get('f8').piece.moves = 10;
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


export function test_Position_fromXY(U) {
  U.assert(Position.fromXY(0, 0) == 'a1');
  U.assert(Position.fromXY(1, 1) == 'b2');
  U.assert(Position.fromXY(25, 25) == 'z26');
  U.assert(Position.fromXY(26, 26) == 'aa27');
  U.assert(Position.fromXY(27, 27) == 'ab28');
  U.assert(Position.fromXY(60, 60) == 'bi61');
  U.assert(Position.fromXY(999, 999) == 'all1000');
}


export function test_Position_toXY(U) {
  U.assert(Position.toXY('a1').join(',') == '0,0');
  U.assert(Position.toXY('b2').join(',') == '1,1');
  U.assert(Position.toXY('z26').join(',') == '25,25');
  U.assert(Position.toXY('aa27').join(',') == '26,26');
  U.assert(Position.toXY('ab28').join(',') == '27,27');
  U.assert(Position.toXY('bi61').join(',') == '60,60');
  U.assert(Position.toXY('all1000').join(',') == '999,999');
  U.assert(Position.toXY('a').join(',') == '-1,-1');
  U.assert(Position.toXY('A1').join(',') == '-1,-1');
}
