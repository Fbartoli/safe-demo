// First we need to import the necessary modules
import { ethers } from 'ethers'
import Safe,{ EthersAdapter } from '@safe-global/protocol-kit'
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
const owner2= new ethers.Wallet(process.env.OWNER_2_PRIVATE_KEY!, provider)

// Initialize the adapter which will allow us to interact with the blockchain
const ethAdapterOwner = new EthersAdapter({
  ethers,
  signerOrProvider: owner2
})

// Initialize a protocol kit instance
const safe = await Safe.create({ ethAdapter: ethAdapterOwner, safeAddress })

//Get the list of pending transactions
const pendingTransactions = await apiKit.getPendingTransactions(safeAddress)
console.log('Your pending transactions are:')
console.log(pendingTransactions)

// Sign transaction to verify that the transaction is coming from owner 1
const signedHash = await safe.signTransactionHash(pendingTransactions.results[0].safeTxHash)
const response = await apiKit.confirmTransaction(pendingTransactions.results[0].safeTxHash, signedHash.data)
console.log('Your transaction has been confirmed:')
console.log(response)
console.log(`https://app.safe.global/transactions/queue?safe=sep:${safeAddress}`)
