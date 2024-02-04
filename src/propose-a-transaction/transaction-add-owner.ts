// First we need to import the necessary modules
import { ethers } from 'ethers'
import Safe,{ EthersAdapter } from '@safe-global/protocol-kit'
import type { MetaTransactionData } from '@safe-global/safe-core-sdk-types'
import SafeApiKit from '@safe-global/api-kit'

const safeAddress = '0x275278677597260293E3e8Da0eCDEC261120E689'

// initialize the API kit
const apiKit = new SafeApiKit({
  chainId: 11155111n
})

// Initialize the RPC URL
// https://chainlist.org/?search=sepolia&testnets=true
const RPC_URL='https://eth-sepolia.public.blastapi.io'
const provider = new ethers.JsonRpcProvider(RPC_URL)

// Initialize signers
const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)

// Initialize the adapter which will allow us to interact with the blockchain
const ethAdapterOwner1 = new EthersAdapter({
  ethers,
  signerOrProvider: owner1Signer
})


// Initialize a protocol kit instance
const safe = await Safe.create({ ethAdapter: ethAdapterOwner1, safeAddress })

//Craft your transaction
// add a owner to the safe

const transaction = await safe.createAddOwnerTx({ ownerAddress: "0x20555478fca062cf948CC93aaf6b7c2ed2B99fF7" })
const safeTxHash = await safe.getTransactionHash(transaction)

// Sign transaction to verify that the transaction is coming from owner 1
const senderSignature = await safe.signTransactionHash(safeTxHash)
//Propose the transaction

await apiKit.proposeTransaction({
  safeAddress,
  safeTransactionData: transaction.data,
  safeTxHash,
  senderAddress: await owner1Signer.getAddress(),
  senderSignature: senderSignature.data,
})
console.log('Your transaction has been proposed:')
console.log(`https://app.safe.global/transactions/queue?safe=sep:${safeAddress}`)

// congratulations! you have proposed your first transaction
