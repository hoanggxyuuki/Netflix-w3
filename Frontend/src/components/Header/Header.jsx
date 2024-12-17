import { useState, useEffect } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const { account, connect, disconnect, loading } = useWeb3();
  const [showDropdown, setShowDropdown] = useState(false);
  const userRole = localStorage.getItem('userrole');
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation(); 
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      <a href="/"><h1>VR Cinema</h1></a>
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
                <button onClick={() => {}}>
                  View Profile
                </button>
                
                {userRole == "admin" && (
                  <Link 
                    to="/admin" 
                    className="dropdown-link"
                    onClick={() => setShowDropdown(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}

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