import axios from 'axios';

// ========================================
// CONFIGURAÇÃO DA API
// ========================================
// URL do backend obtida das variáveis de ambiente
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Configuração do cliente Axios
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================================
// INTERCEPTORS PARA LOGS E TRATAMENTO DE ERRO
// ========================================
// Interceptor para requisições (logs)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respostas (logs e tratamento de erro)
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error);
    
    // Tratamento específico de erros
    if (error.response) {
      // Erro do servidor (4xx, 5xx)
      const { status, data } = error.response;
      console.error(`Server Error ${status}:`, data);
      
      // Personaliza mensagens de erro
      switch (status) {
        case 400:
          throw new Error(data.detail || 'Dados inválidos');
        case 404:
          throw new Error('Recurso não encontrado');
        case 500:
          throw new Error('Erro interno do servidor');
        default:
          throw new Error(data.detail || 'Erro desconhecido');
      }
    } else if (error.request) {
      // Erro de rede
      console.error('Network Error:', error.request);
      throw new Error('Erro de conexão. Verifique sua internet.');
    } else {
      // Outros erros
      throw new Error(error.message || 'Erro desconhecido');
    }
  }
);

// ========================================
// SERVIÇOS DA API
// ========================================

/**
 * Serviço para criar um novo lead
 * @param {Object} leadData - Dados do lead
 * @param {string} leadData.email - Email do lead
 * @param {string} leadData.phone - Telefone do lead
 * @param {string} leadData.source - Origem do lead (opcional)
 * @returns {Promise<Object>} Dados do lead criado + URL do WhatsApp
 */
export const createLead = async (leadData) => {
  try {
    const response = await apiClient.post('/leads', leadData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Serviço para listar todos os leads (admin)
 * @param {number} skip - Número de registros para pular
 * @param {number} limit - Limite de registros
 * @returns {Promise<Array>} Lista de leads
 */
export const getLeads = async (skip = 0, limit = 100) => {
  try {
    const response = await apiClient.get(`/leads?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Serviço para obter estatísticas dos leads
 * @returns {Promise<Object>} Estatísticas dos leads
 */
export const getLeadStats = async () => {
  try {
    const response = await apiClient.get('/leads/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Serviço para marcar que o lead entrou no WhatsApp
 * @param {string} leadId - ID do lead
 * @returns {Promise<Object>} Mensagem de sucesso
 */
export const markWhatsappJoined = async (leadId) => {
  try {
    const response = await apiClient.put(`/leads/${leadId}/whatsapp-joined`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Serviço para verificar saúde da API
 * @returns {Promise<Object>} Status da API
 */
export const checkApiHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient;