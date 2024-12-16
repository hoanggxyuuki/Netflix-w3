// Frontend/src/components/Header/Header.jsx
import { useState, useEffect } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import './Header.css';

const Header = () => {
  const { account, connect, disconnect, loading } = useWeb3();
  const [showDropdown, setShowDropdown] = useState(false);

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation(); // Ngăn event bubble lên document
    setShowDropdown(!showDropdown);
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      <h1>VR Cinema</h1>
      <div className="wallet-container">
        {!account ? (
          <button 
            className={`connect-wallet-btn ${loading ? 'loading' : ''}`}
            onClick={connect}
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="account-dropdown">
            <button 
              className="account-btn"
              onClick={handleDropdownClick}
            >
              {formatAddress(account)}
              <span className="dropdown-arrow">▼</span>
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={() => {/* TODO: Navigate to profile */}}>
                  View Profile
                </button>
                <button onClick={() => {
                  disconnect();
                  setShowDropdown(false);
                }}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;