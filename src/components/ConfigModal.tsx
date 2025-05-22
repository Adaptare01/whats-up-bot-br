
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
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      const savedImage = localStorage.getItem('whatsapp_header_image');
      const savedWebhook = localStorage.getItem('whatsapp_webhook_url');
      
      if (savedImage) {
        setHeaderImageUrl(savedImage);
      }
      
      if (savedWebhook) {
        setWebhookUrl(savedWebhook);
      } else {
        setWebhookUrl('https://primary-production-7d89.up.railway.app/webhook/I.Nova%20Hub');
      }
    }
  }, [isOpen]);

  const handleSaveConfig = () => {
    localStorage.setItem('whatsapp_header_image', headerImageUrl);
    localStorage.setItem('whatsapp_webhook_url', webhookUrl);
    
    toast.success('Configurações atualizadas com sucesso!');
    onClose();
    // Reload the page to apply the new settings
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

          <div className="space-y-2">
            <label htmlFor="webhook-url" className="text-sm font-medium">
              URL do Webhook:
            </label>
            <Input
              id="webhook-url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="Digite a URL do webhook"
            />
            <p className="text-xs text-gray-500 mt-1">
              Configure a URL do webhook para envio e recebimento de mensagens.
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
          <Button onClick={handleSaveConfig}>
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigModal;
