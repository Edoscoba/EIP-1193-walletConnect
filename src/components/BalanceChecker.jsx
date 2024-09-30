import React, { useContext } from 'react';
import { EthereumContext } from './EthereumContext';



const BalanceChecker = () => {
  const { connectToMetaMask, account, chainId, balance, otherBalance, setOtherBalance, address, setAddress, getBalance } = useContext(EthereumContext);

  return (
    <div>
      <h3>Connected Account: {account ? account : 'Not connected'}</h3>
      <h3>Chain ID: {!chainId ? "not connected" : chainId}</h3>
      <p>connected acct bal: <span className="bal">{balance ? balance : "null"}</span></p>
      <button className='connect' onClick={connectToMetaMask}>Connect Wallet</button>
      <input
        type="text"
        placeholder="Enter Ethereum address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={getBalance}>Get Balance</button>
      <p>address balance: <span className="bal">{otherBalance ? otherBalance : "null"}</span></p>

      {/* 
      )} */}
    </div>
  );
};

export default BalanceChecker;
