// First we need to import the necessary modules
import { ethers } from 'ethers'
import { EthersAdapter, SafeFactory, type SafeAccountConfig } from '@safe-global/protocol-kit'

// Initialize the RPC URL
// https://chainlist.org/?search=sepolia&testnets=true
const RPC_URL='https://eth-sepolia.public.blastapi.io'
const provider = new ethers.JsonRpcProvider(RPC_URL)

// Initialize signers
const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY!, provider)
const owner2Signer = new ethers.Wallet(process.env.OWNER_2_PRIVATE_KEY!, provider)

// Initialize the adapter which will allow us to interact with the blockchain
const ethAdapterOwner1 = new EthersAdapter({
  ethers,
  signerOrProvider: owner1Signer
})

const safeAccountConfig: SafeAccountConfig = {
  owners: [
    await owner1Signer.getAddress(),
    await owner2Signer.getAddress(),
  ],
  threshold: 2,
}

//Initialize the SafeFactory
const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 })

//Deploy the Safe
const safe = await safeFactory.deploySafe({safeAccountConfig})
const safeAddress = await safe.getAddress()
console.log('Your Safe has been deployed:')
console.log(`https://sepolia.etherscan.io/address/${safeAddress}`)
console.log(`https://app.safe.global/sep:${safeAddress}`)

// congratulations! You have created a Safe smart account
