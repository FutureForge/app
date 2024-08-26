import { createThirdwebClient, getRpcClient } from "thirdweb";
import { defineChain, sepolia } from "thirdweb/chains";

export const CROSSFI_API = "https://test.xfiscan.com/api/1.0";
export const TEST_ADDRESS = "0xf58941e4258320d76bdab72c5ed8d47c25604e94";
export const MARKETPLACE_CONTRACT =
  "0x693a19b40Cb34dDC2605E60a6261dA891be9a60D"; //sepolia chain
export const TEST_ASSET_ADDRESS = "0x7b26dA758df7A5E101c9ac0DBA8267B95175F229";
export const STAKING_CONTRACT = "0x03D159b0393183023cc9C790BFc45b82a23612ef";
export const STAKING_CONTRACT_TOKEN = '0x99a08a9AA59434cA893aE1A2E771Cf26b1B92E7A'

const clientId = "21c145464870191d752d334f06abcb73";

export const client = createThirdwebClient({
  clientId,
});

export const chainInfo = defineChain({
  id: 4157,
  rpc: "https://rpc.testnet.ms",
  nativeCurrency: {
    decimals: 18,
    name: "XFI",
    symbol: "XFI",
  },
  testnet: true,
  blockExplorers: [
    { name: "Testnet Explorer", url: "https://test.xfiscan.com/" },
  ],
});

export const chainInfoV2 = sepolia;

export const rpcRequest = getRpcClient({ client, chain: chainInfoV2 });
