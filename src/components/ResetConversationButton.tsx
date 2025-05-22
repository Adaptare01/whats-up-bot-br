
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ResetConversationButtonProps {
  onReset: () => void;
}

const ResetConversationButton = ({ onReset }: ResetConversationButtonProps) => {
  return (
    <div className="p-3 bg-gray-100 border-t flex justify-center">
      <Button 
        onClick={onReset}
        className="bg-whatsapp-green hover:bg-whatsapp-dark-green text-white flex items-center gap-2"
      >
        <RefreshCw size={18} />
        Reiniciar Conversa
      </Button>
    </div>
  );
};

export default ResetConversationButton;
