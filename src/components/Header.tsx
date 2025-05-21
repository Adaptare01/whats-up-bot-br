
import { useState, useEffect } from 'react';

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header = ({ onSettingsClick }: HeaderProps) => {
  const [headerImage, setHeaderImage] = useState<string>('');

  useEffect(() => {
    const savedImage = localStorage.getItem('whatsapp_header_image');
    if (savedImage) {
      setHeaderImage(savedImage);
    } else {
      // Default image if none is saved
      setHeaderImage('https://cdn-icons-png.flaticon.com/512/124/124034.png');
    }
  }, []);

  return (
    <header className="chat-header sticky top-0 z-10">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center flex-1 justify-center">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-white flex items-center justify-center">
            {headerImage ? (
              <img 
                src={headerImage} 
                alt="Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/124/124034.png';
                  localStorage.setItem('whatsapp_header_image', 'https://cdn-icons-png.flaticon.com/512/124/124034.png');
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                Logo
              </div>
            )}
          </div>
          <h1 className="font-semibold text-lg">Atendimento</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
