import React from "react";
import '../styles/components/Header.css';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header = () => {
  return (
    <header className="app-header">
      <div className="app-header__container">
        <div className="logo-nav">
          <img src={logo} alt="Logo Tienda de Abarrotes" className="app-header__logo" />
          <h1>Tienda de Abarrotes</h1>
        </div>
        <nav>
          <Link to="/">General</Link>
          <Link to="/agregar">Agregar Producto</Link>
          <Link to="/mostrar">Inventario</Link>
          <Link to="/venta">Realizar Venta</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;