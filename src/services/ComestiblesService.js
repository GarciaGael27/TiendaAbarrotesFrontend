import apiRequest from './api.js';

const comestiblesService = {
  // Obtener todos los comestibles
  getAll: async () => {
    return await apiRequest('/comestibles');
  },

  // Obtener comestible por código visual
  getById: async (codigoVisual) => {
    return await apiRequest(`/comestibles/${codigoVisual}`);
  },

  // Crear nuevo comestible
  create: async (comestibleData) => {
    return await apiRequest('/comestibles', {
      method: 'POST',
      body: JSON.stringify(comestibleData),
    });
  },

  // Actualizar comestible por código visual
  update: async (codigoVisual, comestibleData) => {
    return await apiRequest(`/comestibles/${codigoVisual}`, {
      method: 'PUT',
      body: JSON.stringify(comestibleData),
    });
  },

  // Eliminar comestible por código visual
  delete: async (codigoVisual) => {
    return await apiRequest(`/comestibles/${codigoVisual}`, {
      method: 'DELETE',
    });
  },
};

export default comestiblesService;