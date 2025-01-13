# VR Cinema Platform

A decentralized cinema platform that allows users to watch movies in both traditional and VR formats, powered by blockchain technology and IPFS storage.

## Features

- **Web3 Authentication**: Secure wallet-based authentication using MetaMask
- **Dual Viewing Modes**: Support for both traditional and VR movie playback
- **NFT Integration**: Movies are tokenized as NFTs for ownership verification
- **IPFS Storage**: Decentralized storage for movie files using IPFS via Pinata
- **TMDB Integration**: Access to movie metadata from The Movie Database (TMDB)
- **Playlist Management**: Personal playlist creation and management
- **Admin Dashboard**: Complete movie and user management system

## Tech Stack

### Frontend
- React
- Vite
- Web3 Integration (ethers.js)
- React Router DOM
- Axios for API calls
- React Toastify for notifications

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- IPFS integration via Pinata
- Multer for file uploads
- Winston for logging

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
# Install frontend dependencies
cd Frontend
npm install

# Install backend dependencies
cd Backend
npm install