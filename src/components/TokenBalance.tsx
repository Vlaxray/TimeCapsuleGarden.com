import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';

interface TokenBalanceProps {
  balance: number;
  children?: React.ReactNode;
}

const NFTPreview = ({ image }: { image: string }) => {
  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-sm font-medium mb-2">Ultimo NFT</p>
      <div className="flex items-center">
        <img 
          src={image} 
          alt="NFT" 
          className="w-12 h-12 rounded-lg object-cover mr-3"
        />
        <div>
          <p className="text-xs font-medium">Rosa dell'amore</p>
          <a href="#" className="text-xs text-emerald-600 hover:underline">Vedi collezione</a>
        </div>
      </div>
    </div>
  );
};

const TokenBalance: React.FC<TokenBalanceProps> = ({ balance, children }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-emerald-800">Il Tuo Portafoglio</h2>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-bold">{balance}</span>
        <span className="text-gray-500">TC Tokens</span>
      </div>

      <button className="w-full flex items-center justify-center space-x-2 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
        <FiShoppingCart />
        <span>Compra Gettoni</span>
      </button>

      {children || (
        <NFTPreview image="/nft/rose-123.png" />
      )}
    </div>
  );
};

export default TokenBalance;