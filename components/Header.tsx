
import React from 'react';
import { Menu, MessageSquare, ChevronLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  onChatClick?: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick, onChatClick, showBack, onBack }) => {
  return (
    <header className="flex items-center justify-between px-4 py-4 bg-white sticky top-0 z-50 shadow-sm min-h-[64px]">
      <div className="w-10">
        {showBack ? (
          <button onClick={onBack} className="p-1 -ml-1 active:scale-90 transition-transform">
            <ChevronLeft className="w-7 h-7 text-indigo-900" />
          </button>
        ) : (
          <button onClick={onMenuClick} className="relative focus:outline-none active:scale-90 transition-transform">
            <Menu className="w-6 h-6 text-indigo-900" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border-2 border-white"></div>
          </button>
        )}
      </div>
      
      <h1 className="text-lg font-bold text-indigo-900 text-center flex-1">
        {title}
      </h1>
      
      <div className="w-10 flex justify-end">
        <MessageSquare 
          onClick={onChatClick}
          className="w-6 h-6 text-indigo-900 cursor-pointer active:scale-90 transition-transform" 
        />
      </div>
    </header>
  );
};
