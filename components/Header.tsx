
import React from 'react';
import { SparklesIcon } from './Icons';

interface HeaderProps {
    onStartOver: () => void;
    showStartOver: boolean;
}

const Header: React.FC<HeaderProps> = ({ onStartOver, showStartOver }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-700">
      <div className="flex items-center space-x-3">
        <SparklesIcon className="w-8 h-8 text-emerald-400" />
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">AI Carousel Creator</h1>
      </div>
      {showStartOver && (
         <button
            onClick={onStartOver}
            className="px-4 py-2 text-sm font-semibold text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500"
        >
            Start Over
        </button>
      )}
    </header>
  );
};

export default Header;
