import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { getSoundNftAddressesFromWallet } from "./helpers/optimismScan.js";
import { getArtistReleaseFromCatalog } from "./helpers/catalogScan.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = Number(process.env.PORT) || 8080;

app.get("/", async (req, res) => {
  res.send("saulgoodman....");
});

// Chain: eth, optimism
app.get("/:chain/:address", async (req, res) => {
  const address = req.params.address;
  const chain = req.params.chain as "optimism" | "eth";
  if (address) {
    const soundCollections = await getSoundNftAddressesFromWallet(
      address,
      chain
    );
    const catalogCollections = getArtistReleaseFromCatalog(address, chain);

    const response = {
      soundCollections,
      catalogCollections,
    };
    if (response) {
      res.json(response);
    } else {
      res.send("Unable to retrive NFTs");
    }
  } else {
    res.send("Wallet address is missing");
  }
});

app.listen(port, () => {
  console.log(`Webhook server listening on port ${port}`);
});
