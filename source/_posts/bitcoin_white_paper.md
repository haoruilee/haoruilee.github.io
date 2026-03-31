
---
title: Bitcoin Whitepaper Summary
date: 2024-12-06 01:55:55
tags:
- post
thumbnail: https://i.dawnlab.me/607c95bd6dd7bd63598c9ef297818f97.png
---

# Bitcoin Whitepaper Summary

[Bitcoin: A Peer-to-Peer Electronic Cash System](https://bitcoin.org/bitcoin.pdf)

*2024.12.06, write at the day bitcoin price hit $100,000*

## 1. Introduction
- Bitcoin is a **peer-to-peer electronic cash system** that enables direct transactions without a trusted third party.
- It solves the **double-spending problem** using a decentralized, public ledger (blockchain) secured through **proof-of-work**.
- Transactions are verified by network nodes through cryptography and recorded in a **public distributed ledger**.

## 2. The Problem of Double-Spending
- In traditional systems, trusted intermediaries (e.g., banks) prevent double-spending by maintaining transaction records.
- Bitcoin avoids intermediaries by using a **distributed consensus mechanism** and a **cryptographic ledger** to record transactions.

## 3. Solution: Proof-of-Work (PoW)
- Bitcoin uses a **proof-of-work** system to secure the network. 
- Nodes must find a nonce (a value) that when hashed results in a hash that starts with a specific number of zero bits. 
- The process of finding this nonce requires computational work, making it difficult to alter past transactions.
- **Difficulty adjustments** ensure that the network remains secure even as computational power increases over time.

## 4. Block Structure
- Bitcoin transactions are grouped into **blocks**, each containing a **block header** with a **timestamp**, **previous block hash**, and a **Merkle root** of the transactions.
- The **block header** is hashed, and miners compete to solve a proof-of-work problem for each new block.
- **Block rewards**: The first transaction in a block is a special "coinbase" transaction that rewards the miner with newly created bitcoins.

## 5. Network Operations
- **Transactions**: Each transaction is broadcast to all nodes. When a block is mined, it is also broadcast to all nodes.
- **Block Verification**: Nodes validate the block and its transactions before accepting it. 
- **Longest Chain Rule**: Nodes always consider the longest valid chain as the correct one, even if there are competing chains.
- If two blocks are broadcast simultaneously, nodes will work on the first block they received but will switch to the longer chain if one emerges.
  
## 6. Incentives for Miners
- **Block Rewards**: Miners receive newly minted coins as a reward for solving the proof-of-work problem.
- **Transaction Fees**: Transaction fees are an additional incentive for miners to include transactions in blocks.
- **Transition to Fee-Only System**: After a sufficient number of bitcoins have been issued, transaction fees will become the sole reward for miners.

## 7. Privacy
- **Public transactions** are visible, but the identities of the participants are not directly linked to the transactions.
- Bitcoin improves privacy by keeping public keys anonymous and using new key pairs for each transaction.
- **Linking risk**: Multiple inputs in a transaction reveal that the inputs belong to the same owner.

## 8. Simplified Payment Verification (SPV)
- **SPV** allows users to verify transactions without running a full node. 
- A user only needs the block headers of the longest proof-of-work chain and the Merkle branch for the transaction to verify its inclusion.

## 9. Merkle Trees
- Bitcoin uses **Merkle trees** to efficiently and securely organize transaction data.
- Each transaction is hashed and combined in pairs until a single **Merkle root** is produced. This root is included in the block header.
- Merkle trees allow **efficient verification** of transactions, reducing the amount of data required to verify the integrity of the blockchain.

## 10. Combining and Splitting Value
- Bitcoin transactions allow the splitting and combining of values. Transactions can have multiple inputs and outputs.
- **Change** is returned to the sender if the input value exceeds the transaction value.
- Transactions do not need to store the complete history of inputs and outputs, simplifying the process of combining and splitting value.

## 11. Proof-of-Work Security
- The **proof-of-work** mechanism ensures that attackers cannot modify past blocks without redoing the proof-of-work for all subsequent blocks.
- If an attacker tries to change a block, they must surpass the work done by honest nodes, which becomes increasingly difficult as the blockchain grows.
- The **security** of Bitcoin relies on the assumption that honest nodes control the majority of the computational power.

## 12. Security Against Attackers
- The system is secure as long as honest nodes control more than 50% of the network’s computational power.
- **Binomial Random Walk** and **Gambler's Ruin** models are used to calculate the probability that an attacker can catch up with the honest chain.
- The probability of an attacker catching up decreases exponentially as the number of blocks behind increases.

## 13. Incentive to Remain Honest
- The **proof-of-work** system creates an incentive for miners to act honestly. 
- Miners earn rewards by contributing to the network’s security, making it more profitable to play by the rules than to attack the system.
- Transaction fees and new coin issuance provide a **sustained incentive** for miners even as the block reward decreases over time.

## 14. Conclusion
- Bitcoin provides a solution to the double-spending problem using **peer-to-peer networking** and **proof-of-work**.
- The system is **robust**, **decentralized**, and operates without relying on any central authority.
- The design ensures that **transactions are secure**, and **mining incentives** maintain network integrity.

---

## Key Concepts

- **Proof-of-Work (PoW)**: A system where miners compete to solve cryptographic puzzles, securing the network and validating transactions.
- **Blockchain**: A distributed ledger of transactions that grows in blocks, with each block containing a record of transactions and linked to the previous block.
- **Merkle Tree**: A tree structure used to efficiently verify the integrity of large datasets in the blockchain.
- **Simplified Payment Verification (SPV)**: A method of verifying transactions without downloading the entire blockchain.
- **Incentive Structure**: Miners are rewarded with newly minted bitcoins and transaction fees for securing the network.

## Things I didnt figured out yet

- Seems currently eth and solana use PoS, what is it?
- How does miner pool works?
- In history any success attack?


# Appendix

FTAV's commnet:

FTAV posts between June 2011 and today may have communicated the idea that bitcoin is a negative-sum game being played on a protocol that’s very clever and hypothetically useful as a unit of account, but is chronically inefficient as a conventional means of exchange and is compromised as a store of value. Our posts may also have promoted the idea that the price of a bitcoin is an arbitrary hype gauge that’s disconnected from any utility the token may have, because it’s trivial to duplicate the utility provided by said token, so any intrinsic worth comes from the sunk costs of infrastructure alongside intangibles like regulatory acquiescence, interconnectedness with mainstream financial systems it was once sold as being the antidote to, and the souvenir attraction of “being the first”. 

**We stand by every single one of those posts.**

Nevertheless, with bitcoin’s price recently crossing $100,000, a significant number of commenters seem to feel they deserve an apology in light of our longstanding cynicism, so here it is:

We’re sorry if at any moment in the past 14 years you chose based on our coverage not to buy a thing whose number has gone up. It’s nice when your number goes up. And we’re sorry **if you misunderstood our crypto cynicism to be a declaration of support for tradfi, because we hate that too.**
