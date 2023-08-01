import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import axios from "axios";
import { Interface } from "ethers";
import { SoundTokenData } from "../types";

export const getSoundNftAddressesFromWallet = async (
  wallet: string,
  chain: "optimism" | "eth"
): Promise<SoundTokenData[] | null> => {
  const apiEndpoint =
    chain === "optimism" ? "api-optimistic.etherscan.io" : "api.etherscan.io";
  const apiKey =
    chain === "optimism"
      ? process.env.OPTIMISM_SCAN_API
      : process.env.ETHER_SCAN_API;
  const url = `https://${apiEndpoint}/api?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=${apiKey}`;
  const res = await axios.get(url);
  const txs = res.data.result;
  if (txs) {
    const mintIface = new Interface([
      "function createSoundAndMints(bytes32 salt, bytes initData, address[] contracts, bytes[] data)",
    ]);
    const splitIface = new Interface([
      "function createSplit(address[] accounts, uint32[] percentAllocations, uint32 distributorFee, address controller)",
    ]);

    const soundSongsData: SoundTokenData[] = [];
    let splitAvailable = false;
    let length = -1;
    txs.map((tx) => {
      if (
        //["0x3d1d406a", "0xefef39a1"].includes(tx.methodId) &&
        tx.functionName.includes("createSoundAndMints")
      ) {
        console.log(tx.input, length, splitAvailable);
        const input = tx.input;
        const [, , addresses] = mintIface.decodeFunctionData(
          "createSoundAndMints",
          input
        );
        if (splitAvailable) {
          soundSongsData[length].collectionAddress = addresses[0];
        } else {
          soundSongsData.push({ collectionAddress: addresses[0] });
        }
        splitAvailable = false;
      } else if (
        // tx.methodId === "0x7601f782" &&
        tx.functionName.includes("createSplit")
      ) {
        const input = tx.input;
        const [accounts, percentAllocations] = splitIface.decodeFunctionData(
          "createSplit",
          input
        );
        const credits = [];
        accounts.map((account, i) =>
          credits.push({
            account,
            percentAllocation: Number(percentAllocations[i]) / 10000,
          })
        );
        soundSongsData.push({ credits, collectionAddress: "" });
        length += 1;
        splitAvailable = true;
      }
    });

    // const inputs = soundContractCreatingTxs.map(tx => tx.input);
    // const addresses = inputs.map(input => {
    //     const [, , addresses] = iface.decodeFunctionData('createSoundAndMints', input)
    //     return addresses[0]
    // });
    return soundSongsData;
  }
  return null;
};
