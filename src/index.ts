import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { getSoundNftAddressesFromWallet } from "./helpers/optimismScan.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = Number(process.env.PORT) || 8080;

app.get('/optimism/:address', async  (req, res) => {
  const address = req.params.address
  if(address) {
    const collectionAddresses = await getSoundNftAddressesFromWallet(address)
    if (collectionAddresses) {
      res.json({collectionAddresses})
    } else {
      res.send('Unable to retrive NFTs');
    }
  } else {
    res.send('Wallet address is missing');
  }
});

app.listen(port, () => {
  console.log(`Webhook server listening on port ${port}`);
});
