import apiRequest from './api.js';

const ventaService = {
  // Obtener todas las ventas
  getAll: async () => {
    return await apiRequest('/venta');
  },

  // Obtener venta por ID
  getById: async (id) => {
    return await apiRequest(`/venta/${id}`);
  },

  // Crear nueva venta
  create: async (ventaData) => {
    return await apiRequest('/venta', {
      method: 'POST',
      body: JSON.stringify(ventaData),
    });
  },

  // Eliminar venta por ID
  delete: async (id) => {
    return await apiRequest(`/venta/${id}`, {
      method: 'DELETE',
    });
  },
};

export default ventaService;