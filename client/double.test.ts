import { test, expect } from 'bun:test';
import {
	PublicKey,
	Transaction,
	SystemProgram,
	Keypair,
	LAMPORTS_PER_SOL,
	Connection,
	TransactionInstruction,
	sendAndConfirmTransaction
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


const connection = new Connection('https://solana-devnet.g.alchemy.com/v2/mxERBjRDJBMyKOE2DqXgILP1vx7iulPl');

test("one transfer", async () => {
    const contractPublicKey = new PublicKey(contractAddress);
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
	
	await connection.sendTransaction(tx, [payer, dataAcc]);
	console.log('Data account created:', dataAcc.publicKey.toBase58());

	const initData = new CounterState();
	const buffer = Buffer.from(borsh.serialize(OnchainSchema, initData));
		const initIx = new TransactionInstruction({
		programId: contractPublicKey,
		keys: [{ pubkey: dataAcc.publicKey, isSigner: false, isWritable: true }],
		data: buffer,
	});
	const bl2 = (await connection.getRecentBlockhash()).blockhash

	const tx3 = new Transaction().add(initIx)

	tx3.recentBlockhash = bl2;
	tx3.feePayer = payer.publicKey
	tx3.sign(payer)
	await connection.sendRawTransaction(tx3.serialize());
	
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
		await sendAndConfirmTransaction(connection, tx2, [payer]);
		
		const newDataAcc = await connection.getAccountInfo(dataAcc.publicKey);
		console.log(newDataAcc);
		

	}

	// await doublecount(); 
	// await doublecount(); 
	// await doublecount(); 
	// await doublecount(); 

	
});