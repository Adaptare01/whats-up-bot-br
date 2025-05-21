
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetChat: () => void;
}

const ConfigModal = ({ isOpen, onClose, onResetChat }: ConfigModalProps) => {
  const [headerImageUrl, setHeaderImageUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      const savedImage = localStorage.getItem('whatsapp_header_image');
      if (savedImage) {
        setHeaderImageUrl(savedImage);
      }
    }
  }, [isOpen]);

  const handleSaveImage = () => {
    localStorage.setItem('whatsapp_header_image', headerImageUrl);
    toast.success('Imagem do cabeçalho atualizada com sucesso!');
    onClose();
    // Reload the page to update the header image
    window.location.reload();
  };

  const handleResetChat = () => {
    onResetChat();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label htmlFor="header-image" className="text-sm font-medium">
              URL da Imagem do Cabeçalho:
            </label>
            <Input
              id="header-image"
              value={headerImageUrl}
              onChange={(e) => setHeaderImageUrl(e.target.value)}
              placeholder="Digite a URL da imagem"
            />
            <p className="text-xs text-gray-500 mt-1">
              Insira a URL de uma imagem para ser exibida no cabeçalho.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Gerenciamento de conversa:</h3>
            <Button 
              variant="destructive" 
              onClick={handleResetChat}
              className="w-full"
            >
              Reiniciar Conversa
            </Button>
            <p className="text-xs text-gray-500 mt-1">
              Isso irá apagar todas as mensagens e iniciar uma nova sessão.
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="mr-2"
          >
            Cancelar
          </Button>
          <Button onClick={handleSaveImage}>
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigModal;
