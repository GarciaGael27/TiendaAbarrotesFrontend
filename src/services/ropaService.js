import apiRequest from './api.js';

const ropaService = {
  // Obtener todos los productos de ropa
  getAll: async () => {
    return await apiRequest('/ropa');
  },

  // Obtener producto de ropa por código visual
  getById: async (codigoVisual) => {
    return await apiRequest(`/ropa/${codigoVisual}`);
  },

  // Crear nuevo producto de ropa
  create: async (ropaData) => {
    return await apiRequest('/ropa', {
      method: 'POST',
      body: JSON.stringify(ropaData),
    });
  },

  // Actualizar producto de ropa por código visual
  update: async (codigoVisual, ropaData) => {
    return await apiRequest(`/ropa/${codigoVisual}`, {
      method: 'PUT',
      body: JSON.stringify(ropaData),
    });
  },

  // Eliminar producto de ropa por código visual
  delete: async (codigoVisual) => {
    return await apiRequest(`/ropa/${codigoVisual}`, {
      method: 'DELETE',
    });
  },
};

export default ropaService;