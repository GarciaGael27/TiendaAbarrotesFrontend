import React, { useState } from 'react';
import '../styles/pages/AddProduct.css';

const AddProduct = () => {
  const [productData, setProductData] = useState({
    // Campos comunes a todos los productos
    nombre: '',
    precio: '',
    marca: '',
    cantidad: '',
    categoria: '',
    
    // Campos específicos para comestibles
    fecha_caducidad: '',
    tipo: '',
    porcion: '',
    
    // Campos específicos para limpieza
    uso: '',
    porcion_limpieza: '',
    
    // Campos específicos para ropa
    tipo_tela: '',
    talla: '',
    tipo_ropa: '',
    color: '',
    genero: ''
  });

  const categorias = [
    'Comestibles',
    'Limpieza',
    'Ropa'
  ];

  const tallasRopa = ['CH', 'M', 'G', 'XL', 'U'];
  const generosRopa = ['Masculino', 'Femenino', 'Unisex'];
  const tiposComestibles = ['Enlatado', 'Fresco', 'Congelado', 'Seco', 'Bebida'];
  const usoLimpieza = ['Cocina', 'Baño', 'Ropa', 'Pisos', 'General'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Preparar datos según la categoría
    let dataToSend = {
      nombre: productData.nombre,
      precio: parseFloat(productData.precio),
      marca: productData.marca,
      cantidad: parseInt(productData.cantidad),
      categoria: productData.categoria
    };

    // Agregar campos específicos según la categoría
    if (productData.categoria === 'Comestibles') {
      dataToSend = {
        ...dataToSend,
        fecha_caducidad: productData.fecha_caducidad,
        tipo: productData.tipo,
        porcion: productData.porcion
      };
    } else if (productData.categoria === 'Limpieza') {
      dataToSend = {
        ...dataToSend,
        uso: productData.uso,
        porcion: productData.porcion_limpieza
      };
    } else if (productData.categoria === 'Ropa') {
      dataToSend = {
        ...dataToSend,
        tipo_tela: productData.tipo_tela,
        talla: productData.talla,
        tipo: productData.tipo_ropa,
        color: productData.color,
        genero: productData.genero
      };
    }

    console.log('Datos del producto:', dataToSend);
    
    // Resetear formulario después del envío
    setProductData({
      nombre: '',
      precio: '',
      marca: '',
      cantidad: '',
      categoria: '',
      fecha_caducidad: '',
      tipo: '',
      porcion: '',
      uso: '',
      porcion_limpieza: '',
      tipo_tela: '',
      talla: '',
      tipo_ropa: '',
      color: '',
      genero: ''
    });
    
    alert('Producto agregado exitosamente');
  };

  const renderSpecificFields = () => {
    switch (productData.categoria) {
      case 'Comestibles':
        return (
          <>
            <div className="form-group">
              <label htmlFor="fecha_caducidad" className="form-label">
                Fecha de Caducidad
              </label>
              <input
                type="date"
                id="fecha_caducidad"
                name="fecha_caducidad"
                className="form-input"
                value={productData.fecha_caducidad}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group form-group--half">
                <label htmlFor="tipo" className="form-label">
                  Tipo
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  className="form-select"
                  value={productData.tipo}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona un tipo</option>
                  {tiposComestibles.map((tipo, index) => (
                    <option key={index} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group form-group--half">
                <label htmlFor="porcion" className="form-label">
                  Porción
                </label>
                <input
                  type="text"
                  id="porcion"
                  name="porcion"
                  className="form-input"
                  placeholder="Ej: 500 g, 1 L, 250 ml"
                  value={productData.porcion}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </>
        );

      case 'Limpieza':
        return (
          <>
            <div className="form-row">
              <div className="form-group form-group--half">
                <label htmlFor="uso" className="form-label">
                  Uso
                </label>
                <select
                  id="uso"
                  name="uso"
                  className="form-select"
                  value={productData.uso}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona un uso</option>
                  {usoLimpieza.map((uso, index) => (
                    <option key={index} value={uso}>
                      {uso}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group form-group--half">
                <label htmlFor="porcion_limpieza" className="form-label">
                  Porción
                </label>
                <input
                  type="text"
                  id="porcion_limpieza"
                  name="porcion_limpieza"
                  className="form-input"
                  placeholder="Ej: 1 L, 500 ml, 2 kg"
                  value={productData.porcion_limpieza}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </>
        );

      case 'Ropa':
        return (
          <>
            <div className="form-row">
              <div className="form-group form-group--half">
                <label htmlFor="tipo_tela" className="form-label">
                  Tipo de Tela
                </label>
                <input
                  type="text"
                  id="tipo_tela"
                  name="tipo_tela"
                  className="form-input"
                  placeholder="Ej: Algodón, Poliéster"
                  value={productData.tipo_tela}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group form-group--half">
                <label htmlFor="talla" className="form-label">
                  Talla
                </label>
                <select
                  id="talla"
                  name="talla"
                  className="form-select"
                  value={productData.talla}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona una talla</option>
                  {tallasRopa.map((talla, index) => (
                    <option key={index} value={talla}>
                      {talla}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group form-group--half">
                <label htmlFor="tipo_ropa" className="form-label">
                  Tipo de Ropa
                </label>
                <input
                  type="text"
                  id="tipo_ropa"
                  name="tipo_ropa"
                  className="form-input"
                  placeholder="Ej: Camisa, Pantalón"
                  value={productData.tipo_ropa}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group form-group--half">
                <label htmlFor="color" className="form-label">
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  className="form-input"
                  placeholder="Ej: Azul, Rojo"
                  value={productData.color}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="genero" className="form-label">
                Género
              </label>
              <select
                id="genero"
                name="genero"
                className="form-select"
                value={productData.genero}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona un género</option>
                {generosRopa.map((genero, index) => (
                  <option key={index} value={genero}>
                    {genero}
                  </option>
                ))}
              </select>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="add-product">
      <div className="add-product__container">
        <div className="add-product__header">
          <h1 className="add-product__title">
            <span className="add-product__icon">+</span>
            Agregar Producto
          </h1>
          <p className="add-product__subtitle">Ingresa los datos del nuevo producto</p>
        </div>

        <form className="add-product__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre del Producto
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="form-input"
              placeholder="Ej: Arroz Integral 1kg"
              value={productData.nombre}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria" className="form-label">
              Categoría
            </label>
            <select
              id="categoria"
              name="categoria"
              className="form-select"
              value={productData.categoria}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="marca" className="form-label">
              Marca
            </label>
            <input
              type="text"
              id="marca"
              name="marca"
              className="form-input"
              placeholder="Nombre de la marca"
              value={productData.marca}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group form-group--half">
              <label htmlFor="precio" className="form-label">
                Precio ($)
              </label>
              <input
                type="number"
                id="precio"
                name="precio"
                className="form-input"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={productData.precio}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group form-group--half">
              <label htmlFor="cantidad" className="form-label">
                Cantidad
              </label>
              <input
                type="number"
                id="cantidad"
                name="cantidad"
                className="form-input"
                placeholder="0"
                min="0"
                value={productData.cantidad}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {renderSpecificFields()}

          <button type="submit" className="add-product__submit-btn">
            <span className="submit-btn__icon">+</span>
            Agregar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
