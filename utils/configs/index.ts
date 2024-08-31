import { createThirdwebClient, getRpcClient } from 'thirdweb'
import { defineChain, sepolia } from 'thirdweb/chains'

// old
export const MARKETPLACE_CONTRACT = '0x693a19b40Cb34dDC2605E60a6261dA891be9a60D' //sepolia chain
export const TEST_ASSET_ADDRESS = '0x7b26dA758df7A5E101c9ac0DBA8267B95175F229'
export const STAKING_CONTRACT = '0x03D159b0393183023cc9C790BFc45b82a23612ef'
export const STAKING_CONTRACT_TOKEN = '0x99a08a9AA59434cA893aE1A2E771Cf26b1B92E7A'

const CLIENT_ID = '21c145464870191d752d334f06abcb73'
export const SECRET_KEY =
  'OyGuPbPM5sY4r8S2QqhZzowcQ87Ht8wvACAny43O1nc8csLM3HYGX8YbqLPZ3r5foKZgifnxr_QFD62DvOH11w'

// new
export const CROSSFI_API = 'https://test.xfiscan.com/api/1.0'
export const CROSSFI_MARKETPLACE_CONTRACT = '0x7Ed11a18630a9E569882Ca2F4D3488A88eF45d28'
export const TEST_WALLET_ADDRESS = '0xf58941e4258320d76bdab72c5ed8d47c25604e94'
export const CROSSFI_TEST_ASSET_ADDRESS = '0x544C945415066564B0Fb707C7457590c0585e838'

export const client = createThirdwebClient({
  clientId: CLIENT_ID,
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
