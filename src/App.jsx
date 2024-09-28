import React, { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import './App.css';
import { ethers } from 'ethers';

function App() {
  // State to store the connected account, chain ID, and balance
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [address, setAddress] = useState('');

  
  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount(null);
      setBalance(null);
      console.log('Please connect to MetaMask.');
    }
  };

  
  const handleChainChanged = (chainId) => {
    setChainId(chainId);
    
    setBalance(null);
  };

  
  const connectToMetaMask = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (provider && provider === window.ethereum) {
        console.log('MetaMask is available!');

        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        handleAccountsChanged(accounts);

        
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        handleChainChanged(chainId);

        
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
      } else {
        console.log('MetaMask is not available!');
      }
    } catch (error) {
      if (error.code === 4001) {
        console.log('User rejected the connection request.');
      } else {
        console.error(error);
      }
    }
  };

  
  const getBalance = async () => {
    if (!address) {
      alert('Please enter a valid Ethereum address');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(null);
    }
  };

  // I am setting up MetaMask on component mount
  useEffect(() => {
    connectToMetaMask();
    // I am cleaning upevent listeners on component unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>MetaMask Integration with React</h1>
        <button onClick={connectToMetaMask}>Enable Ethereum</button>
        <div className="info">
          <p className="showAccount">Account: {account ? account : 'Not connected'}</p>
          <p className="showChainId">Chain ID: {chainId ? chainId : 'Not connected'}</p>
          <div className="balance-checker">
            <input
              type="text"
              placeholder="Enter Ethereum Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button onClick={getBalance}>Get Balance</button>
          </div>
          <p className="showBalance">Balance: {balance !== null ? `${balance} ETH` : 'N/A'}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
