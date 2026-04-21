import apiRequest from './api.js';

const empleadoService = {
  // Obtener todos los empleados
  getAll: async () => {
    return await apiRequest('/empleado');
  },

  // Obtener empleado por CURP
  getByCurp: async (curp) => {
    return await apiRequest(`/empleado/${curp}`);
  },

  // Crear nuevo empleado
  create: async (empleadoData) => {
    return await apiRequest('/empleado', {
      method: 'POST',
      body: JSON.stringify(empleadoData),
    });
  },

  // Actualizar empleado por CURP
  update: async (curp, empleadoData) => {
    return await apiRequest(`/empleado/${curp}`, {
      method: 'PUT',
      body: JSON.stringify(empleadoData),
    });
  },

  // Eliminar empleado por CURP
  delete: async (curp) => {
    return await apiRequest(`/empleado/${curp}`, {
      method: 'DELETE',
    });
  },
};

export default empleadoService;