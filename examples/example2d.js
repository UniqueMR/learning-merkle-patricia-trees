// Example 2d - Creating and looking up an extension node

const Trie = require("merkle-patricia-tree").BaseTrie; // We import the library required to create a basic Merkle Patricia Tree

var trie = new Trie(); // We create an empty Patricia Merkle Tree

async function test() {
  console.log(Buffer.from("testKey"));
  console.log(Buffer.from("testKey0001"));
  console.log(Buffer.from("testKey000A"));

  await trie.put(Buffer.from("testKey"), Buffer.from("testValue"));
  await trie.put(Buffer.from("testKey0001"), Buffer.from("testValue1"));
  await trie.put(Buffer.from("testKey000A"), Buffer.from("testValueA"));

  var node1 = await trie.findPath(Buffer.from("testKey"));
  // console.log(node1.node); // The branch node
  // console.log("Node: ", node1.node._branches[3]); // The address of our child node. Let's look it up:

  var node2 = await trie._lookupNode(Buffer.from(node1.node._branches[3]));
  // console.log(node2); // An extension node!
  console.log(node2._value)

  var node3 = await trie._lookupNode(Buffer.from(node2._value));
  console.log(node3);
}

test();
