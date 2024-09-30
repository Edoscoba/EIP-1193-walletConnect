import React, { createContext, useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';


export const EthereumContext = createContext();


export const EthereumProvider = ({ children }) => {

  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [otherBalance, setOtherBalance] = useState(null);
  const [address, setAddress] = useState('');

  // Function to handle account changes
  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount(null);
      setBalance(null);
      console.log('Please connect to MetaMask.');
    }
  };

  // Function to handle chain ID changes
  const handleChainChanged = (chainId) => {
    setChainId(chainId);
    
  };

  // Function to connect to MetaMask and set up listeners
  const connectToMetaMask = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (provider && provider === window.ethereum) {
        console.log('MetaMask is available!');

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        handleAccountsChanged(accounts);

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        handleChainChanged(chainId);

        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(accounts[0]);
          setBalance(ethers.formatEther(balance));
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance(null);
        }
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

  // Function to fetch the balance of an entered address
  const getBalance = async () => {
    if (!address) {
      alert('Please enter a valid Ethereum address');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const otherBalance = await provider.getBalance(address);
      setOtherBalance(ethers.formatEther(otherBalance));
    } catch (error) {
      console.error('Error fetching balance:', error);
      setOtherBalance(null);
    }
  };

  // useEffect to set up MetaMask connection on mount
  useEffect(() => {
    // connectToMetaMask();
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Cleanup on unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Return the context provider with the global state
  return (
    <EthereumContext.Provider
      value={{
        connectToMetaMask,
        account,
        chainId,
        balance,
        otherBalance,
        address,
        setAddress,
        getBalance,
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
};
