export type SoundTokenData = {
  collectionAddress: string;
  credits?: { account: string; percentAllocation: number }[];
};

export type CatalogTokenData = {
  collectionAddress: string;
  tokenIds: string[];
};
