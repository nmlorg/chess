import * as estree from './estree.js';


class SubstitutedExpression extends estree.Node {
  constructor(name, full, local) {
    super();
    this.name = name;
    this.full = full;
    this.local = local;
  }

  toString() {
    return this.name;
  }
}


export function replacePieces(node, pieces, iscall=false) {
  if (Array.isArray(node))
    return node.map(subnode => replacePieces(subnode, pieces));

  if (!(node instanceof estree.Node) || (node instanceof estree.Literal))
    return node;

  let full = String(node);
  let subiscall = node instanceof estree.CallExpression;

  for (let [k, v] of Object.entries(node))
    node[k] = replacePieces(v, pieces, subiscall);

  let local = String(node);
  if (iscall && (node instanceof estree.MemberExpression))
    local = `${local}.bind(${node.object})`;
  let sub = new SubstitutedExpression(`__tmp${pieces.length}`, full, local);
  pieces.push(sub);
  return sub;
}
