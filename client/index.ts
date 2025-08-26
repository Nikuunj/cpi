import { test, expect } from 'bun:test';
import {
	PublicKey,
	Transaction,
	SystemProgram,
	Keypair,
	LAMPORTS_PER_SOL,
	Connection,
	TransactionInstruction,
	sendAndConfirmTransaction,
	sendAndConfirmRawTransaction,
	SendTransactionError
} from "@solana/web3.js";
import { contractAddress, secret_key } from './config';
import * as borsh from 'borsh';



class CounterState {
  count: number;
  
  constructor() {
    this.count = 0;
  }
}

const OnchainSchema: borsh.Schema = {
    struct: {
      count: 'u32'
    }
};


const connection = new Connection('https://api.testnet.solana.com');

async function main() {
    const contractPublicKey = new PublicKey('5kCVXWv8UKXjJWus7vwR9CvECW3kqWZgBRGQrnbAcfQa');
	const payer = Keypair.fromSecretKey(secret_key);
	console.log(payer.publicKey.toBase58());
	
	const dataAcc = new Keypair();
	const blockhash = (await connection.getLatestBlockhash()).blockhash;
	const miniRent = await connection.getMinimumBalanceForRentExemption(4);
	const ixs = [
		SystemProgram.createAccount({
			fromPubkey: payer.publicKey,
			newAccountPubkey: dataAcc.publicKey,
            lamports: miniRent,
            space: 4,
            programId: contractPublicKey
		}),
	];
	const tx = new Transaction();
	tx.recentBlockhash = blockhash;
    tx.feePayer = payer.publicKey;
	tx.add(...ixs);
	
	const sign =  await connection.sendTransaction(tx, [payer, dataAcc]);
	await connection.confirmTransaction(sign);
	
	console.log('Data account created:', dataAcc.publicKey.toBase58());

	const initData = new CounterState();
	// const buffer = Buffer.from(borsh.serialize(OnchainSchema, initData));
	// 	const initIx = new TransactionInstruction({
	// 	programId: contractPublicKey,
	// 	keys: [{ pubkey: dataAcc.publicKey, isSigner: false, isWritable: true }],
	// 	data: buffer,
	// });
	// const bl2 = (await connection.getLatestBlockhash()).blockhash

	// const tx3 = new Transaction().add(initIx)

	// tx3.recentBlockhash = bl2;
	// tx3.feePayer = payer.publicKey
	// await sendAndConfirmTransaction(connection, tx3, [payer]);
	
	const newDataAcc = await connection.getAccountInfo(dataAcc.publicKey);
	console.log(newDataAcc);

	async function doublecount() {
		const blockhash = (await connection.getLatestBlockhash()).blockhash;
		const ix2 = new TransactionInstruction({
			programId: contractPublicKey,
			keys: [
    			{ pubkey: dataAcc.publicKey, isSigner: false, isWritable: true },
			],
			data: Buffer.from(''),
		})

		const tx2 = new Transaction().add(ix2);
		tx2.recentBlockhash = blockhash;
		tx2.feePayer = payer.publicKey
		await sendAndConfirmTransaction(connection, tx2, [payer, dataAcc]);
		
		const newDataAcc = await connection.getAccountInfo(dataAcc.publicKey);
		console.log(newDataAcc);
		

	}

	await doublecount(); 
	await doublecount(); 
	await doublecount(); 
	await doublecount(); 

	
};

main();