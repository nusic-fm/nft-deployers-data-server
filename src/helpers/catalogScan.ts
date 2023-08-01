import { CatalogTokenData } from "../types";
import catalogJson from "./catalog.json" assert { type: "json" };

export const getArtistReleaseFromCatalog = (
  address: string,
  chain: string
): CatalogTokenData | null => {
  if (chain === "eth") {
    const ownersJson = catalogJson as {
      [key: string]: { tokenIds: string[]; collectionAddress: string };
    };
    const ownerInfo = ownersJson[address];
    return ownerInfo;
  }
  return null;
};
