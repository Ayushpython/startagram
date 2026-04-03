import axios from 'axios';

// REACT_APP_API_URL is set in .env (baked into the build at compile time)
// Development:  http://localhost:5000/api
// Production:   https://your-domain.com/api  OR  /api (if same-origin)
const API_BASE_URL =
  process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
};

// Users
export const usersAPI = {
  getProfile: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  searchUsers: (q) => api.get('/users/search', { params: { q } }),
  updateProfile: (id, data) => api.put(`/users/${id}`, data),
  saveBlueprint: (userId, blueprintId) => api.post(`/users/${userId}/save-blueprint`, { blueprintId }),
  unsaveBlueprint: (userId, blueprintId) => api.delete(`/users/${userId}/unsave-blueprint/${blueprintId}`),
};

// Blueprints
export const blueprintsAPI = {
  create: (data) => api.post('/blueprints', data),
  getAll: (params) => api.get('/blueprints', { params }),
  getOne: (id) => api.get(`/blueprints/${id}`),
  update: (id, data) => api.put(`/blueprints/${id}`, data),
  delete: (id) => api.delete(`/blueprints/${id}`),
  publish: (id) => api.post(`/blueprints/${id}/publish`),
  getByAuthor: (authorId) => api.get(`/blueprints/author/${authorId}`),
};

// Marketplace
export const marketplaceAPI = {
  search: (params) => api.get('/marketplace/search', { params }),
  getCategories: () => api.get('/marketplace/categories'),
  getTrending: () => api.get('/marketplace/trending'),
  getRecommendations: () => api.get('/marketplace/recommendations'),
  rate: (blueprintId, data) => api.post(`/marketplace/${blueprintId}/rate`, data),
};

// Comments
export const commentsAPI = {
  create: (data) => api.post('/comments', data),
  getByBlueprint: (blueprintId) => api.get(`/comments/${blueprintId}`),
  update: (id, data) => api.put(`/comments/${id}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
  like: (id) => api.post(`/comments/${id}/like`),
};

// Collaboration
export const collaborationAPI = {
  create: (data) => api.post('/collaboration', data),
  getRequests: (params) => api.get('/collaboration', { params }),
  getOne: (id) => api.get(`/collaboration/${id}`),
  accept: (id) => api.put(`/collaboration/${id}/accept`),
  reject: (id, data) => api.put(`/collaboration/${id}/reject`, data),
};

// Wallet
export const walletAPI = {
  getWallet: (userId) => api.get(`/wallet/${userId}`),
  addFunds: (userId, data) => api.post(`/wallet/${userId}/add-funds`, data),
  withdraw: (userId, data) => api.post(`/wallet/${userId}/withdraw`, data),
};

// Transactions
export const transactionsAPI = {
  create: (data) => api.post('/transactions', data),
  getAll: (params) => api.get('/transactions', { params }),
  getOne: (id) => api.get(`/transactions/${id}`),
  refund: (id) => api.post(`/transactions/${id}/refund`),
};

// Validation
export const validationAPI = {
  getValidation: (blueprintId) => api.get(`/validation/${blueprintId}`),
  generate: (blueprintId) => api.post(`/validation/${blueprintId}/generate`),
  getComparables: () => api.get('/validation/market-comparables'),
};

// Chat
export const chatAPI = {
  createOrGetConversation: (data) => api.post('/chat/conversation', data),
  getMyConversations: () => api.get('/chat/conversation'),
  getMessages: (conversationId) => api.get(`/chat/conversation/${conversationId}/messages`),
  sendMessage: (conversationId, data) => api.post(`/chat/conversation/${conversationId}/messages`, data),
};

export default api;
