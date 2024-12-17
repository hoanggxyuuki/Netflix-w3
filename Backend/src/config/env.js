require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  TMDB_API_KEY: process.env.TMDB_API_KEY,
  IPFS_PROJECT_ID: process.env.IPFS_PROJECT_ID,
  IPFS_PROJECT_SECRET: process.env.IPFS_PROJECT_SECRET,
  NFT_CONTRACT_ADDRESS: process.env.NFT_CONTRACT_ADDRESS,
  WEB3_PROVIDER_URL: process.env.WEB3_PROVIDER_URL,
  PINATA_API_KEY: process.env.PINATA_API_KEY,
  PINATA_API_SECRET: process.env.PINATA_API_SECRET,
  PINATA_JWT: process.env.PINATA_JWT

};
