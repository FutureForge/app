import { createThirdwebClient, getRpcClient } from 'thirdweb'
import { defineChain, sepolia } from 'thirdweb/chains'

// old
export const MARKETPLACE_CONTRACT = '0x693a19b40Cb34dDC2605E60a6261dA891be9a60D' //sepolia chain
export const TEST_ASSET_ADDRESS = '0x7b26dA758df7A5E101c9ac0DBA8267B95175F229'
export const STAKING_CONTRACT = '0x03D159b0393183023cc9C790BFc45b82a23612ef'
export const STAKING_CONTRACT_TOKEN = '0x99a08a9AA59434cA893aE1A2E771Cf26b1B92E7A'

// new
export const CROSSFI_API = 'https://test.xfiscan.com/api/1.0'
export const CROSSFI_MARKETPLACE_CONTRACT = '0x7Ed11a18630a9E569882Ca2F4D3488A88eF45d28'
export const TEST_WALLET_ADDRESS = '0xf58941e4258320d76bdab72c5ed8d47c25604e94'
export const CROSSFI_TEST_ASSET_ADDRESS = '0x544C945415066564B0Fb707C7457590c0585e838'

export const CROSSFI_MINTER_ADDRESS = '0x6AF8860bA9eEd41C3a3C69249Da5ef8Ac36d20DE'
export const CROSSFI_STAKING_CONTRACT = '0xB244f70F623Ca37A044ecB67caC38dA9fA1e167E'
export const CROSSFI_TOKEN_CONTRACT = '0x63019ee1b42737E262145F767946cC2A78462532'
export const CROSSFI_WRAPPED_TOKEN_CONTRACT = '0x10e6414ddea2e2be27e23584c651bc0a49e11e07'

// 0x55babEE194af5c59a5f17f9DeA47BE4a37DFB36d

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
})

export const chainInfo = defineChain({
  id: 4157,
  rpc: 'https://crossfi-testnet-jsonrpc.itrocket.net',
  nativeCurrency: {
    decimals: 18,
    name: 'XFI',
    symbol: 'XFI',
  },
  testnet: true,
  blockExplorers: [{ name: 'Testnet Explorer', url: 'https://test.xfiscan.com/' }],
})

// https://rpc.testnet.ms
// https://crossfi-testnet.public.blastapi.io
// https://evmrpc-t.crossfi.nodestake.org/
// https://testnet-crossfi-evm.konsortech.xyz
// https://crossfi-testnet-jsonrpc.itrocket.net

// export const chainInfo = defineChain(11155111)
// export const chainInfo = defineChain(4157)

export const chainInfoV2 = sepolia

export const rpcRequest = getRpcClient({ client, chain: chainInfo })

// [
// {
//   "listingId": "0",
//   "tokenId": "0",
//   "quantity": "1",
//   "pricePerToken": "10000000000000000000",
//   "startTimestamp": "1725053335",
//   "endTimestamp": "2040413335",
//   "listingCreator": "0x1FFE2134c82D07227715af2A12D1406165A305BF",
//   "assetContract": "0x544C945415066564B0Fb707C7457590c0585e838",
//   "currency": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
//   "tokenType": 0,
//   "status": 1,
//   "reserved": false
// }
// ]
