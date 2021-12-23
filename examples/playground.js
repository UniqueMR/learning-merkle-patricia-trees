const Trie = require("merkle-patricia-tree").BaseTrie;

var trie = new Trie();
console.log("Empty trie root (Bytes): ", trie.root);
async function test(){
    await trie.put(Buffer.from("abcdf"), Buffer.from("value1"));
    await trie.put(Buffer.from("abczg"), Buffer.from("value2"));
    await trie.put(Buffer.from("abcz11111i"), Buffer.from("value3"));
    await trie.put(Buffer.from("abcz111112"), Buffer.from("value4"));

    node1 = await trie.findPath(Buffer.from("abc"));
    // node2 = await trie.findPath(Buffer.from(node1.node._branches[6][1]))
    // node2 = await trie._lookupNode(Buffer.from(node1.node._branches[6]));
    node2 = await trie.findPath(Buffer.from("abcz"))
    // console.log(node2.node);
    // node3 = await trie._lookupNode(Buffer.from(node2.node._branches[3]));
    console.log(node2.node);
    node3 = await trie._lookupNode(Buffer.from(node2.node._branches[3]));
    console.log(node3)
    console.log(await trie._lookupNode(Buffer.from(node3._value)));
}

test();