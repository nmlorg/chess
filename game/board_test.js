import {Board} from './board.js';


export function testReset(U) {
  let board = new Board();
  U.assert(board.rows instanceof Array);
  U.assert(board.rows.length == 0);
  board.reset();
  U.assert(board.rows.length == 8);
}
