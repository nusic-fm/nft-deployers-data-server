import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import axios from "axios"
import { Interface } from "ethers";


export const getSoundNftAddressesFromWallet = async (wallet: string) => {
    const url = `https://api-optimistic.etherscan.io/api?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.OPTIMISM_SCAN_API}`
    const res = await axios.get(url);
    const txs = res.data.result;
    if(txs) {
        const soundContractCreatingTxs = txs.filter(tx => tx.methodId === '0x3d1d406a' && tx.functionName.includes('createSoundAndMints'));
        const iface = new Interface(['function createSoundAndMints(bytes32 salt, bytes initData, address[] contracts, bytes[] data)'])
    
        const inputs = soundContractCreatingTxs.map(tx => tx.input);
        const addresses = inputs.map(input => {
            const [, , addresses] = iface.decodeFunctionData('createSoundAndMints', input)
            return addresses[0]
        });
        return addresses;
    } 
    return null
}