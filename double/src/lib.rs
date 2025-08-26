use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info , AccountInfo}, entrypoint, entrypoint::ProgramResult, pubkey::Pubkey,
};

entrypoint!(process_instruction);

#[derive(BorshDeserialize, BorshSerialize)]
struct OnchainData {
    count: u32 // 4 bytes
}


fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo], // data account
    instruction_data: &[u8],
) -> ProgramResult {

    let mut iter = accounts.iter();
    let data_account = next_account_info(&mut iter)?;

    if !data_account.is_signer {
        return ProgramResult::Err(solana_program::program_error::ProgramError::MissingRequiredSignature)
    }

    let mut counter = OnchainData::try_from_slice(&data_account.data.borrow())?;

    if counter.count == 0 {
        counter.count = 1;
    } else {
        counter.count = counter.count * 2;
    }

    counter.serialize(&mut *data_account.data.borrow_mut())?;

    ProgramResult::Ok(())

}
