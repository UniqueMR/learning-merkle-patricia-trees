# Basic knowledge

## Patricia Trie

An efficient Radix Trie, a data structure in which "keys" represent the path one has to take to reach a node

## Merkle Tree

A hash tree in which each node's hash is computed from its child nodes hashes

# Examples & explanation

## Creating and updating trees

### example 1a: creating and updating a base trie

* we can retrieve our value using the key
* we can also note that the root hash of the tree has automatically been updated 

* each distinct tree will have a distinct root, we can therefore quickly know if two trees are identical by comparing their roots
* keys and values are stored and retrieved as raw bytes
* values undergo an additional transformation before they are stored, they are encoded using the **Recursive Length Prefix encoding function**
* In ethereum, keys also undergo another transformation : they are converted using a hash function (keccak256). The BaseTrie library does not do this.

### example 1b: Manually Creating and Updating a Secure Trie

* use the keccak256 hash key instead of the key itself (using the ethereumjs-util library)
* convert our keys and values to Bytes ( using buffer.from(_string) )
* only the root hash of the tree has changed, as the key has changed from `"testkey"` to `keccak256("testkey")`

### example 1c: Automatically creating and updating a secure trie

* a library called `SecureTrie` that automatically takes care of the keccak256 hashing

### example 1d: Deleting a Key-Value Pair from a trie

* `get`: retrieving key-value pairs 
* `put`: adding key-value pairs
* `del`: delete key-value pairs

## A deeper look at individual nodes

In a standard "trie", the key is a **path** to follow step by step (i.e. one hexadecimal value at a time) to reach the destination: **value**.

Every time we take a step to along that trie, we step on what's called a **node**. In Patricia Tries, there are different kinds of nodes:

* `null`: A non-existent node
* `branch`: A node that links ("branches out") to up to16 distinct child notes. A branch node can also itself has a value
* `leaf`: An end-node that contains the final part of the path and a value
* `extension`: A shortcut node that provides a partial path and a destination. Extension nodes are used to "bypass" unnecessary nodes when only one valid branch exists for a sequence of nodes. (**Patricia tries provide to improve the standard tries**)

### example2a: creating and looking up a null node

* `findPath`: a method that returns the node at a certain path

### example2b: creating and looking up a branch node

* for a branch to exist, we need to create a common path that eventually diverges
* `79`stands for the letter `y`
* Even there's no value assigned to the key (path) `"testKey"`(an empty `<Buffer >`). However, the node at `"testKey"`is still a branch node, containing two branches 
* The index are not determined at random: **they correspond to the next hex-value of the path of our two keys (hex values `3` and `4`)**
* **A key difference between standard ("Radix") tries and Patricia tries**: avoid unnecessary `branch` nodes by creating `extension` nodes at the beginning of the common path to act as "shortcuts". 
* the encoded path in leaf and extensions nodes: 
  * the remainingPath : the first hex character `3` indicates whether the node is a leaf node, or an extension node, the first hex character also indicates whether or not the remaining path is of "odd" or "even" 

| hex char | bits | node type | path length |
| :------: | :--: | :-------: | :---------: |
|    0     | 0000 | extension |    even     |
|    1     | 0001 | extension |     odd     |
|    2     | 0010 |   leaf    |    even     |
|    3     | 0011 |   leaf    |     odd     |



### example2c: looking up a leaf node

* `_nibbles`: indicates the last hex characters that differentiate this leaf from the parent branch. 

### example2d: looking up a extension node

* if the Recursive Length Prefix encoding of the child node is less than 32 bytes, the node is stored directly. However, if the RLP encoding is longer than 32 bytes, a hash of the node is stored in the branch node, which can be used to lookup the child node directly. 
* `_nibbles` (the encoded path) stand for the remaining path, this is the path that we shortcut
* attention: extension is built for finding the next "branch", so if no "branch" exists in the coming path, there's no need to build extension

## Generating and Verifying Hashes

Merkle trees are hash trees that allow us to efficiently verify information.

**The hash is not the same as the path we take when going down the trie**

The difference between paths and hashes:

* paths: a sequence of instructions for a given input
* hashes: acts as a unique identifiers for each node and are generated in a way that allows the verification of data. 

How are hashes calculated in Ethereum?:

* First, all values from the node are serialized using the Recursive Length Prefix encoding function
* Then, a hash function (keccak256) is applied to the serialized data. This outputs a 32-bytes hash

### 3a. generating a hash

### 3b. Verification using a hash 

Ethereum takes advantage of the uniqueness of each hash to efficiently secure the network. 

Without Merkle Trees, each Ethereum client would need to store the full history of the blockchain to verify transactions. 

With Merkle Trees, they only need to provide with the information required to re-compute the trusted root hash

## Merkle Patricia Trees in Ethereum

The four Merkle Patricia Trees in Ethereum:

* The Global State Tree
* The Transactions Tree
* The Receipts Tree
* The Storage Tree

### The Transactions tree

The purpose of the transaction tree is to record transaction requests. It can answer question like: "What is the value of this transaction?" or "Who sent this transaction?". In the Ethereum blockchain, **each block has its own transactions tree.** A path is needed to navigate the tree and access a particular transaction. **In the transaction tree, this path is given by the *Recursive Layer Protocol* encoding of the transaction's index in the block.** 

What our destination looks like? -> key-value pair:

* **The key** is the hash of the value. This is the "key" that we use when uniquely referencing a node (not the path that is used to navigate the key-value pair)
* **The value** is the Recursive Layer Protocol encoding of the node itself (which, if the transaction exists, will most likely be a leaf node). In the context of a transaction, `leafValue` will contain information relevant to our transaction (like its value, and who sent it).

### 4a. Retrieving a transaction from the Ethereum Blockchain

### 4b. Generating a transaction hash from transaction data 

A standard transaction is an array containing the following items (in hex): `[once, gasPrice, gasLimit, to, value, input, v, r, s]`

