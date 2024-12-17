const axios = require('axios');
const FormData = require('form-data');
const { AppError } = require('../middlewares/errorHandler');
const { PINATA_JWT } = require('../config/env');

class IPFSService {
  constructor() {
    if (!PINATA_JWT) {
      console.error('PINATA_JWT is not configured');
      throw new Error('PINATA_JWT is required');
    }

    this.api = axios.create({
      baseURL: 'https://api.pinata.cloud',
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`
      }
    });
  }

  async uploadFile(buffer, filename) {
    try {
      const formData = new FormData();
      formData.append('file', buffer, {
        filename: filename || 'file'
      });

      console.log('Uploading to Pinata with JWT:', PINATA_JWT.substring(0, 10) + '...');

      const response = await this.api.post('/pinning/pinFileToIPFS', formData, {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
        }
      });

      return `ipfs://${response.data.IpfsHash}`;
    } catch (error) {
      console.error('IPFS upload error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw new AppError('Error uploading file to IPFS', 500);
    }
  }

  async uploadFiles(files) {
    try {
      const uploadPromises = files.map(file => 
        this.uploadFile(file.buffer, file.originalname)
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new AppError('Error uploading files to IPFS', 500);
    }
  }

  getIPFSGatewayUrl(ipfsUrl) {
    if (!ipfsUrl.startsWith('ipfs://')) {
      throw new AppError('Invalid IPFS URL', 400);
    }
    const hash = ipfsUrl.replace('ipfs://', '');
     return `https://gateway.pinata.cloud/ipfs/${hash}`;
  }

  async testConnection() {
    try {
      await this.api.get('/data/testAuthentication');
      return true;
    } catch (error) {
      console.error('Pinata connection test failed:', error);
      return false;
    }
  }
}

module.exports = new IPFSService(); 