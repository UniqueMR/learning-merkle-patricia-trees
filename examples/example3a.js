// Example 3a - Generating a hash

const Trie = require("merkle-patricia-tree").BaseTrie; // We import the library required to create a basic Merkle Patricia Tree
const rlp = require("rlp");
const { keccak256 } = require('ethereumjs-util')
var trie = new Trie(); // We create an empty Patricia Merkle Tree

async function test() {
  // We populate the tree to create an extension node.
  await trie.put(Buffer.from("testKey"), Buffer.from("testValue"));
  await trie.put(Buffer.from("testKey0001"), Buffer.from("testValue1"));
  await trie.put(Buffer.from("testKey000A"), Buffer.from("testValueA"));

  var node1 = await trie.findPath(Buffer.from("testKey"));
  var node2 = await trie._lookupNode(Buffer.from(node1.node._branches[3]));

  console.log("Our computed hash:       ", keccak256(rlp.encode(node2.raw())));
  console.log("The extension node hash: ", node1.node._branches[3]);
}

test();
