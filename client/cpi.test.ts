// import { test, expect } from 'bun:test';
// import {
// 	PublicKey,
// 	Transaction,
// 	SystemProgram,
// 	Keypair,
// 	LAMPORTS_PER_SOL,
// 	Connection,
//     TransactionInstruction
// } from "@solana/web3.js";
// import { contractAddress, cpiAddress, secret_key } from './config';

// const connection = new Connection('https://solana-devnet.g.alchemy.com/v2/mxERBjRDJBMyKOE2DqXgILP1vx7iulPl');

// test("cpi test", async () => {
//     const contractPublicKey = new PublicKey(contractAddress);
// 	const payer = Keypair.fromSecretKey(secret_key);
// 	const dataAcc = new Keypair();
// 	const blockhash = (await connection.getLatestBlockhash()).blockhash;
// 	const miniRent = await connection.getMinimumBalanceForRentExemption(4);
// 	const ixs = [
// 		SystemProgram.createAccount({
// 			fromPubkey: payer.publicKey,
// 			newAccountPubkey: dataAcc.publicKey,
//             lamports: miniRent,
//             space: 4,
//             programId: contractPublicKey
// 		}),
// 	];
// 	const tx = new Transaction();
// 	tx.recentBlockhash = blockhash;
//     tx.feePayer = payer.publicKey;
// 	tx.add(...ixs);
// 	await connection.sendTransaction(tx, [payer, dataAcc]);
// 	console.log(dataAcc.publicKey.toBase58());
	

//     async function doubleCount() {
//         const cpiPubkey = new PublicKey(cpiAddress)
//         const ix = new TransactionInstruction({
//             programId: cpiPubkey,
//             keys: [
//                 { pubkey: dataAcc.publicKey, isSigner: false, isWritable: true },
//                 { pubkey: contractPublicKey, isSigner: false, isWritable: true }
//             ],
//             data: Buffer.from("")  
//         })
//         const blockhash = (await connection.getLatestBlockhash()).blockhash;
//         const tx = new Transaction();
//         tx.recentBlockhash = blockhash;
//         tx.feePayer = payer.publicKey;
//         tx.add(...ixs);
//         await connection.sendTransaction(tx, [payer]);

//         const newDataAcc = await connection.getAccountInfo(dataAcc.publicKey);
//         console.log(newDataAcc?.data.toString());
//     }

//     await doubleCount();
// });