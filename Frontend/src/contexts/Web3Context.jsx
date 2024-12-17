import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { authApi } from '../services/api';

const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const checkConnection = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        handleDisconnect();
        return;
      }

      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);
            setAccount(accounts[0]);
          } else {
            handleDisconnect();
          }
        } catch (error) {
          console.error('Error checking connection:', error);
          handleDisconnect();
        }
      }
    };

    checkConnection();
  }, []);

  const handleAuth = async (address, signer) => {
    try {
      const nonce = Math.floor(Math.random() * 1000000).toString();
      const message = `Please sign this message to verify your identity.\nNonce: ${nonce}`;
      
      const signature = await signer.signMessage(message);
      
      const response = await authApi.login(address, signature);
      console.log('Auth response:', response);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('userrole', response.data.data.user.role);
        setAccount(address);
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Failed to authenticate wallet');
      handleDisconnect();
    }
  };

  const connect = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask!');
      return;
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      await handleAuth(accounts[0], signer);
      
      setProvider(provider);
      setAccount(accounts[0]);
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect wallet');
      handleDisconnect();
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setAccount(null);
    setProvider(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userrole');
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          handleDisconnect();
        }
      });

      window.ethereum.on('disconnect', () => {
        handleDisconnect();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleDisconnect);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, []);

  return (
    <Web3Context.Provider 
      value={{ 
        account, 
        provider, 
        
        connect, 
        disconnect: handleDisconnect,
        loading 
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context); 