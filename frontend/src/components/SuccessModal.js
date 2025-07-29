import React, { useState, useEffect } from 'react';
import { CheckCircle, ExternalLink, X } from 'lucide-react';

/**
 * MODAL DE SUCESSO APÓS CADASTRO
 * 
 * Componente que exibe o modal de sucesso quando o usuário
 * se cadastra com sucesso na landing page.
 * 
 * Props:
 * - isOpen: boolean - Se o modal está visível
 * - onClose: function - Função para fechar o modal
 * - whatsappUrl: string - URL do grupo do WhatsApp
 * - userEmail: string - Email do usuário cadastrado
 */
const SuccessModal = ({ isOpen, onClose, whatsappUrl, userEmail }) => {
  // ========================================
  // ESTADOS LOCAIS
  // ========================================
  const [countdown, setCountdown] = useState(5); // Contador para redirecionamento automático
  const [redirecting, setRedirecting] = useState(false);

  // ========================================
  // EFEITOS
  // ========================================
  // Contador regressivo para redirecionamento automático
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleWhatsAppRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // ========================================
  // HANDLERS
  // ========================================
  
  /**
   * Redireciona para o WhatsApp
   * Pode ser chamado automaticamente ou manualmente
   */
  const handleWhatsAppRedirect = () => {
    setRedirecting(true);
    
    // Abre o WhatsApp em uma nova aba
    window.open(whatsappUrl, '_blank');
    
    // Fecha o modal após um pequeno delay
    setTimeout(() => {
      onClose();
      setRedirecting(false);
      setCountdown(5); // Reset contador
    }, 1000);
  };

  /**
   * Cancela o redirecionamento automático
   */
  const handleCancelAutoRedirect = () => {
    setCountdown(0); // Para o contador
  };

  // Não renderiza se não estiver aberto
  if (!isOpen) return null;

  return (
    <>
      {/* OVERLAY DO MODAL */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* CONTAINER DO MODAL */}
        <div 
          className="network-card max-w-md w-full mx-auto relative"
          onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar no modal
          style={{ maxWidth: '500px' }}
        >
          {/* BOTÃO FECHAR */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          {/* CONTEÚDO DO MODAL */}
          <div className="text-center">
            {/* ÍCONE DE SUCESSO */}
            <div className="mb-4">
              <CheckCircle 
                size={64} 
                className="mx-auto text-green-500 mb-4"
                style={{ color: 'var(--brand-primary)' }}
              />
            </div>

            {/* TÍTULO */}
            <h2 className="heading-2 mb-2" style={{ color: 'var(--text-primary)' }}>
              🎉 Cadastro Realizado!
            </h2>

            {/* MENSAGEM DE CONFIRMAÇÃO */}
            <p className="body-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
              Olá! Seu cadastro foi realizado com sucesso.
            </p>

            {/* EMAIL CADASTRADO */}
            <div className="bg-gray-100 rounded-lg p-3 mb-4">
              <p className="body-small">
                <strong>Email cadastrado:</strong> {userEmail}
              </p>
            </div>

            {/* INSTRUÇÕES */}
            <div className="mb-6">
              <h3 className="heading-3 mb-2">Próximos Passos:</h3>
              <div className="text-left">
                <div className="flex items-start mb-2">
                  <span className="inline-block w-6 h-6 bg-green-500 text-white rounded-full text-sm font-bold mr-3 mt-0.5 flex items-center justify-center">1</span>
                  <p className="body-small">Entre no nosso grupo VIP do WhatsApp</p>
                </div>
                <div className="flex items-start mb-2">
                  <span className="inline-block w-6 h-6 bg-green-500 text-white rounded-full text-sm font-bold mr-3 mt-0.5 flex items-center justify-center">2</span>
                  <p className="body-small">Receba seu e-book gratuito "3 Mitos sobre o Envelhecimento"</p>
                </div>
                <div className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-green-500 text-white rounded-full text-sm font-bold mr-3 mt-0.5 flex items-center justify-center">3</span>
                  <p className="body-small">Comece a receber dicas exclusivas diariamente</p>
                </div>
              </div>
            </div>

            {/* REDIRECIONAMENTO AUTOMÁTICO */}
            {countdown > 0 && !redirecting && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="body-small">
                  Redirecionamento automático em <strong>{countdown}s</strong>
                </p>
                <button 
                  onClick={handleCancelAutoRedirect}
                  className="text-sm underline mt-1 hover:no-underline"
                >
                  Cancelar
                </button>
              </div>
            )}

            {/* BOTÕES DE AÇÃO */}
            <div className="space-y-3">
              {/* BOTÃO PRINCIPAL - ENTRAR NO WHATSAPP */}
              <button
                onClick={handleWhatsAppRedirect}
                disabled={redirecting}
                className="btn-cta w-full"
                style={{ 
                  opacity: redirecting ? 0.7 : 1,
                  cursor: redirecting ? 'not-allowed' : 'pointer'
                }}
              >
                <ExternalLink className="inline-block mr-2" size={20} />
                {redirecting ? 'Redirecionando...' : 'Entrar no Grupo VIP'}
              </button>

              {/* BOTÃO SECUNDÁRIO - FECHAR */}
              <button
                onClick={onClose}
                className="btn-secondary w-full"
              >
                Fechar e Entrar Depois
              </button>
            </div>

            {/* AVISO DE SEGURANÇA */}
            <p className="caption mt-4 text-gray-500">
              🔒 Seus dados estão seguros conosco. Não enviamos spam.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessModal;