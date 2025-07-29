import React, { useState, useEffect } from 'react';
import { Heart, Users, Download, CheckCircle, Star, MessageCircle, Loader2 } from 'lucide-react';
import mockData from '../data/mock';
import { createLead } from '../services/api';
import SuccessModal from './SuccessModal';

/**
 * =========================================
 * COMPONENTE PRINCIPAL - LANDING PAGE
 * =========================================
 * 
 * Este é o componente principal da landing page para captura de leads
 * do grupo VIP "Vida Ativa 50+".
 * 
 * PERSONALIZAÇÃO FÁCIL:
 * - Cores: Edite as variáveis CSS no App.css (seção :root)
 * - Textos: Modifique as constantes CONTENT_CONFIG abaixo
 * - Estilos: Classes CSS organizadas por seção no App.css
 * - Dados: Arquivo mockData em /data/mock.js para conteúdo estático
 */

const LandingPage = () => {
  // ========================================
  // CONFIGURAÇÃO DE CONTEÚDO (FÁCIL PERSONALIZAÇÃO)
  // ========================================
  const CONTENT_CONFIG = {
    // Informações da marca
    BRAND_NAME: "Vida Ativa 50+",
    BRAND_TAGLINE: "Transformando vidas através da saúde e do bem-estar",
    
    // Textos do Hero
    HERO_TITLE: "Descubra os Segredos para uma Vida Mais Ativa e Saudável aos 50+",
    HERO_SUBTITLE: "Junte-se ao nosso grupo VIP do WhatsApp e receba dicas exclusivas sobre saúde, exercícios e bem-estar especialmente desenvolvidas para pessoas maduras.",
    HERO_CTA: "Quero Meu E-book Gratuito",
    
    // Informações do e-book
    EBOOK_TITLE: "3 Mitos sobre o Envelhecimento e como Viver com Mais Vitalidade",
    
    // Configurações de redirecionamento
    AUTO_REDIRECT_DELAY: 5, // segundos
    
    // Mensagens do formulário
    SUCCESS_MESSAGE: "Cadastro realizado com sucesso! Você receberá o e-book em breve.",
    ERROR_MESSAGE: "Ops! Algo deu errado. Tente novamente."
  };

  // ========================================
  // ESTADOS DO COMPONENTE
  // ========================================
  const [isVisible, setIsVisible] = useState(false); // Controla animações de entrada
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados do modal de sucesso
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  // ========================================
  // EFEITOS
  // ========================================
  useEffect(() => {
    // Ativa animações após o componente montar
    setIsVisible(true);
  }, []);

  // ========================================
  // HANDLERS DO FORMULÁRIO
  // ========================================
  
  /**
   * Atualiza os dados do formulário
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpa erro quando usuário começa a digitar
    if (error) {
      setError('');
    }
  };

  /**
   * Formata telefone automaticamente enquanto o usuário digita
   */
  const formatPhone = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica formatação (11) 99999-9999
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
                   .replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
                   .replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    
    return value;
  };

  /**
   * Valida dados do formulário antes do envio
   */
  const validateForm = () => {
    const { email, phone } = formData;
    
    if (!email || !phone) {
      setError('Por favor, preencha todos os campos.');
      return false;
    }
    
    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um e-mail válido.');
      return false;
    }
    
    // Validação básica de telefone (pelo menos 10 dígitos)
    const phoneNumbers = phone.replace(/\D/g, '');
    if (phoneNumbers.length < 10) {
      setError('Por favor, insira um telefone válido com DDD.');
      return false;
    }
    
    return true;
  };

  /**
   * Submete o formulário para a API
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Prepara dados para envio
      const leadData = {
        email: formData.email.trim(),
        phone: formData.phone.replace(/\D/g, ''), // Remove formatação
        source: 'landing_page'
      };
      
      console.log('📤 Enviando dados:', leadData);
      
      // Chama API para criar lead
      const response = await createLead(leadData);
      
      console.log('✅ Lead criado com sucesso:', response);
      
      // Guarda URL do WhatsApp para o modal
      setWhatsappUrl(response.whatsapp_group_url);
      
      // Limpa formulário
      setFormData({ email: '', phone: '' });
      
      // Mostra modal de sucesso
      setShowSuccessModal(true);
      
    } catch (err) {
      console.error('❌ Erro ao criar lead:', err);
      setError(err.message || CONTENT_CONFIG.ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navegação suave para seções da página
   */
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  // ========================================
  // RENDERIZAÇÃO DO COMPONENTE
  // ========================================
  return (
    <div className="landing-page">
      
      {/* ========================================
          HEADER DE NAVEGAÇÃO
          ========================================
          Header fixo com logo e navegação
          Personalize cores em App.css (.network-header) */}
      <header className="network-header">
        <nav className="nav-wrapper">
          <div className="network-logo">
            <Heart className="inline-block mr-2" size={20} />
            {CONTENT_CONFIG.BRAND_NAME}
          </div>
          <div className="network-nav">
            <button onClick={() => scrollToSection('about')} className="network-nav-link">
              Sobre
            </button>
            <button onClick={() => scrollToSection('ebook')} className="network-nav-link">
              E-book
            </button>
            <button onClick={() => scrollToSection('benefits')} className="network-nav-link">
              Benefícios
            </button>
          </div>
        </nav>
      </header>

      {/* ========================================
          SEÇÃO HERO
          ========================================
          Primeira seção com título principal e CTA
          Personalize estilos na classe .hero */}
      <section className="hero py-8" style={{ paddingTop: '120px' }}>
        <div className="container">
          <div className="text-center">
            {/* Título principal com animação */}
            <h1 className={`display-large mb-4 ${isVisible ? 'animated fadeIn' : 'animated'}`}>
              {CONTENT_CONFIG.HERO_TITLE}
            </h1>
            
            {/* Subtítulo com animação atrasada */}
            <p className={`body-large mb-4 ${isVisible ? 'animated fadeIn delay-200ms' : 'animated'}`}>
              {CONTENT_CONFIG.HERO_SUBTITLE}
            </p>
            
            {/* CTA principal com animação mais atrasada */}
            <div className={`${isVisible ? 'animated fadeIn delay-500ms' : 'animated'}`}>
              <button 
                onClick={() => scrollToSection('signup')} 
                className="btn-cta"
              >
                <Download className="inline-block mr-2" size={20} />
                {CONTENT_CONFIG.HERO_CTA}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          SEÇÃO E-BOOK PREVIEW
          ========================================
          Apresenta os benefícios do e-book gratuito
          Dados vem de mockData.ebookBenefits */}
      <section id="ebook" className="ebook-section py-8" style={{ backgroundColor: 'var(--bg-subtle)' }}>
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="heading-1 mb-2">E-book Gratuito</h2>
            <h3 className="heading-2 mb-4">"{CONTENT_CONFIG.EBOOK_TITLE}"</h3>
          </div>
          
          {/* Grid de benefícios do e-book */}
          <div className="network-grid">
            {mockData.ebookBenefits.map((benefit, index) => (
              <div key={index} className="network-card hover-lift">
                <div className="network-card-title">
                  <CheckCircle className="inline-block mr-2 text-green-600" size={24} />
                  {benefit.title}
                </div>
                <div className="network-card-content">
                  {benefit.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          SEÇÃO BENEFÍCIOS DO WHATSAPP
          ========================================
          Lista os benefícios de entrar no grupo VIP
          Dados vem de mockData.whatsappBenefits */}
      <section id="benefits" className="benefits-section py-8">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="heading-1 mb-2">Por que Entrar no Nosso Grupo VIP?</h2>
            <p className="body-large">Benefícios exclusivos para transformar sua saúde e qualidade de vida</p>
          </div>
          
          {/* Grid de benefícios do WhatsApp */}
          <div className="network-grid">
            {mockData.whatsappBenefits.map((benefit, index) => (
              <div key={index} className="network-card hover-lift">
                <div className="network-card-title">
                  <Users className="inline-block mr-2" size={24} />
                  {benefit.title}
                </div>
                <div className="network-card-content">
                  {benefit.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          SEÇÃO DEPOIMENTOS
          ========================================
          Prova social com depoimentos de clientes
          Dados vem de mockData.testimonials */}
      <section className="testimonials-section py-8" style={{ backgroundColor: 'var(--bg-subtle)' }}>
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="heading-1 mb-2">O que Nossos Membros Dizem</h2>
            <p className="body-large">Depoimentos reais de pessoas que transformaram suas vidas</p>
          </div>
          
          {/* Grid de depoimentos */}
          <div className="network-grid">
            {mockData.testimonials.map((testimonial, index) => (
              <div key={index} className="network-card hover-lift">
                <div className="network-card-content mb-2">
                  {/* Estrelas de avaliação */}
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="text-yellow-500" size={16} fill="currentColor" />
                    ))}
                  </div>
                  
                  {/* Texto do depoimento */}
                  "{testimonial.content}"
                </div>
                
                {/* Informações do cliente */}
                <div className="network-card-title" style={{ fontSize: '1.1rem' }}>
                  {testimonial.name}, {testimonial.age} anos
                </div>
                <div className="caption">{testimonial.location}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          SEÇÃO FORMULÁRIO DE CADASTRO
          ========================================
          Formulário para capturar leads
          Integrado com a API do backend */}
      <section id="signup" className="signup-section py-8">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="heading-1 mb-2">Comece Sua Transformação Hoje</h2>
            <p className="body-large">Preencha os dados abaixo e receba seu e-book gratuito + acesso ao grupo VIP</p>
          </div>
          
          {/* Container do formulário */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="network-card">
              
              {/* Campo Email */}
              <div className="mb-4">
                <label htmlFor="email" className="body-medium mb-2 block">
                  E-mail *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Seu melhor e-mail"
                />
              </div>
              
              {/* Campo WhatsApp */}
              <div className="mb-4">
                <label htmlFor="phone" className="body-medium mb-2 block">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    setFormData(prev => ({ ...prev, phone: formatted }));
                  }}
                  required
                  disabled={loading}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                />
              </div>
              
              {/* Exibição de erros */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="body-small text-red-600">
                    ⚠️ {error}
                  </p>
                </div>
              )}
              
              {/* Botão de submit */}
              <button 
                type="submit" 
                disabled={loading}
                className="btn-cta w-full"
                style={{ 
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="inline-block mr-2 animate-spin" size={20} />
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <MessageCircle className="inline-block mr-2" size={20} />
                    Quero Entrar no Grupo VIP
                  </>
                )}
              </button>
              
              {/* Aviso de privacidade */}
              <p className="caption text-center mt-2">
                🔒 Seus dados estão seguros conosco. Não enviamos spam.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ========================================
          FOOTER
          ========================================
          Rodapé da página com informações da marca */}
      <footer className="footer py-4" style={{ backgroundColor: 'var(--brand-dark)', color: 'white' }}>
        <div className="container">
          <div className="text-center">
            <div className="mb-2">
              <Heart className="inline-block mr-2" size={20} />
              <span className="font-semibold">{CONTENT_CONFIG.BRAND_NAME}</span>
            </div>
            <p className="body-small">
              {CONTENT_CONFIG.BRAND_TAGLINE}
            </p>
            <p className="caption mt-2">
              © 2024 {CONTENT_CONFIG.BRAND_NAME}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* ========================================
          MODAL DE SUCESSO
          ========================================
          Modal exibido após cadastro bem-sucedido */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        whatsappUrl={whatsappUrl}
        userEmail={formData.email}
      />
    </div>
  );
};

export default LandingPage;