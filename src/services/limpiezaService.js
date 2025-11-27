import apiRequest from './api.js';

const limpiezaService = {
  // Obtener todos los productos de limpieza
  getAll: async () => {
    return await apiRequest('/limpieza');
  },

  // Obtener producto de limpieza por código visual
  getById: async (codigoVisual) => {
    return await apiRequest(`/limpieza/${codigoVisual}`);
  },

  // Crear nuevo producto de limpieza
  create: async (limpiezaData) => {
    return await apiRequest('/limpieza', {
      method: 'POST',
      body: JSON.stringify(limpiezaData),
    });
  },

  // Actualizar producto de limpieza por código visual
  update: async (codigoVisual, limpiezaData) => {
    return await apiRequest(`/limpieza/${codigoVisual}`, {
      method: 'PUT',
      body: JSON.stringify(limpiezaData),
    });
  },

  // Eliminar producto de limpieza por código visual
  delete: async (codigoVisual) => {
    return await apiRequest(`/limpieza/${codigoVisual}`, {
      method: 'DELETE',
    });
  },
};

export default limpiezaService;