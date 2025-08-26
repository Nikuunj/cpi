use solana_program::{
    account_info::{ next_account_info, AccountInfo }, entrypoint, entrypoint::{ ProgramResult}, instruction::{AccountMeta, Instruction}, program::invoke, pubkey::Pubkey
};

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {

    let mut inter =  accounts.iter();

    let data_account = next_account_info(&mut inter)?;
    let double_contract_address = next_account_info(&mut inter)?;

    let instruction = Instruction {
        program_id: *double_contract_address.key,
        accounts: vec![AccountMeta {
            is_signer: false,
            is_writable: true,
            pubkey: *data_account.key
        }],
        data: vec![]
    };

    invoke(&instruction, &[data_account.clone()])?;
    Ok(())
}
