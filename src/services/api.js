const API_BASE_URL = 'http://localhost:3001/api';

const apiRequest = async (url, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    if (!response.ok) {
      let errorData;
      let errorText;
      
      try {
        errorText = await response.text();
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || `HTTP error! status: ${response.status}` };
      }
      
      console.error('API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        url: `${API_BASE_URL}${url}`,
        method: config.method || 'GET',
        headers: config.headers,
        body: config.body,
        errorData
      });
      
      throw new Error(errorData.message || errorText || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

export default apiRequest;
export { API_BASE_URL };