import { ethers } from "ethers";

export function decimalOffChain(
  number: number,
  decimalPlaces: string = "ethers"
) {
  const value = ethers.utils.formatUnits(number, decimalPlaces);

  return value;
}
