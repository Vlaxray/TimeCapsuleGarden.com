import { ethers } from "ethers";
import { CONTRACT_ABI } from "./abi";

const CONTRACT_ADDRESS = "0xTUO_CONTRATTO";

export function getContract(signerOrProvider: any) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}
