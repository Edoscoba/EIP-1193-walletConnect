import React from 'react';
import "./App.css"
import { EthereumProvider } from './components/EthereumContext';
import BalanceChecker from './components/BalanceChecker';

const App = () => {
  return (
    <EthereumProvider>
      <div className="App-header">
        <h1>EIP 1193 wallet connect</h1>
        <BalanceChecker />
      </div>
    </EthereumProvider>
  );
};

export default App;
