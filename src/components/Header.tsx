import { useState, useEffect } from 'react';

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header = ({ onSettingsClick }: HeaderProps) => {
  const [headerImage, setHeaderImage] = useState<string>('');

  useEffect(() => {
    setHeaderImage('/inova%20unoesc.png');
  }, []);

  return (
    <header className="chat-header sticky top-0 z-10" style={{ height: 45, minHeight: 45, maxHeight: 45, paddingTop: 5, paddingBottom: 5 }}>
      <div className="flex items-center justify-between w-full h-full">
        <div className="flex items-center flex-1 justify-center h-full">
          <div className="w-full h-full flex items-center justify-center">
            {headerImage ? (
              <img 
                src={headerImage} 
                alt="Logo" 
                style={{ height: '35px', maxHeight: '35px', objectFit: 'contain', width: 'auto', display: 'block' }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                Logo
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
