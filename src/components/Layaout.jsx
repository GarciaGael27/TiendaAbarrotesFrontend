import React from 'react';
import { Outlet } from 'react-router-dom'; // <-- Importar Outlet
import Header from './Header.jsx';


const Layout = () => {
  return (
    <div style={{ width: '100%', margin: 0, padding: 0 }}>
      <Header />
      <main style={{ width: '100%', margin: 0, padding: '20px' }}>
        {/* El Outlet renderizará el componente de la ruta hija */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;