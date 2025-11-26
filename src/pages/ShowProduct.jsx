import React, { useState, useEffect } from 'react';
import { SearchIcon, EditIcon, DeleteIcon, BoxIcon } from '../components/Icons';
import '../styles/pages/ShowProduct.css';

const ShowProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Datos simulados - en el futuro vendrán del backend
  const mockProducts = [
    {
      id: 1,
      nombre: 'Arroz Integral 1kg',
      categoria: 'Granos',
      precio: 25.50,
      stock: 50,
      proveedor: 'Distribuidora Central',
      fechaIngreso: '14/11/2025'
    },
    {
      id: 2,
      nombre: 'Aceite Vegetal 1L',
      categoria: 'Aceites',
      precio: 35.00,
      stock: 30,
      proveedor: 'Comercial del Norte',
      fechaIngreso: '17/11/2025'
    },
    {
      id: 3,
      nombre: 'Frijol Negro 1kg',
      categoria: 'Granos',
      precio: 28.00,
      stock: 45,
      proveedor: 'Distribuidora Central',
      fechaIngreso: '15/11/2025'
    },
    {
      id: 4,
      nombre: 'Azúcar Refinada 1kg',
      categoria: 'Endulzantes',
      precio: 22.00,
      stock: 60,
      proveedor: 'Dulce Provisión',
      fechaIngreso: '16/11/2025'
    },
    {
      id: 5,
      nombre: 'Sal de Mesa 1kg',
      categoria: 'Condimentos',
      precio: 8.50,
      stock: 80,
      proveedor: 'Comercial del Norte',
      fechaIngreso: '18/11/2025'
    }
  ];

  useEffect(() => {
    // Simular carga de datos del backend
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  useEffect(() => {
    // Filtrar productos basado en el término de búsqueda
    const filtered = products.filter(product =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleEdit = (productId) => {
    console.log('Editar producto:', productId);
    // Aquí se implementará la navegación al formulario de edición
    alert(`Editar producto con ID: ${productId}`);
  };

  const handleDelete = (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      console.log('Eliminar producto:', productId);
      // Aquí se conectará con el backend para eliminar
      setProducts(products.filter(product => product.id !== productId));
      alert('Producto eliminado exitosamente');
    }
  };

  const getStockStatus = (stock) => {
    if (stock > 30) return 'disponible';
    if (stock > 10) return 'medio';
    return 'bajo';
  };

  return (
    <div className="show-product">
      <div className="show-product__container">
        {/* Header */}
        <div className="show-product__header">
          <div className="header__title-section">
            <h1 className="header__title">
              <BoxIcon size={24} />
              Inventario de Productos
            </h1>
            <p className="header__subtitle">Lista completa de productos en inventario</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="show-product__search">
          <div className="search-container">
            <SearchIcon size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre, categoría o proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="show-product__table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Proveedor</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="product-name">{product.nombre}</td>
                  <td className="product-category">{product.categoria}</td>
                  <td className="product-price">${product.precio.toFixed(2)}</td>
                  <td className="product-stock">
                    {product.stock}
                    <span className={`stock-badge stock-badge--${getStockStatus(product.stock)}`}>
                      Disponible
                    </span>
                  </td>
                  <td className="product-supplier">{product.proveedor}</td>
                  <td className="product-date">{product.fechaIngreso}</td>
                  <td className="product-actions">
                    <button
                      className="action-btn action-btn--edit"
                      onClick={() => handleEdit(product.id)}
                      title="Editar producto"
                    >
                      <EditIcon size={16} />
                    </button>
                    <button
                      className="action-btn action-btn--delete"
                      onClick={() => handleDelete(product.id)}
                      title="Eliminar producto"
                    >
                      <DeleteIcon size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="no-products">
              <p>No se encontraron productos que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>

        {/* Pagination (for future implementation) */}
        <div className="show-product__pagination">
          <div className="pagination-info">
            Mostrando {filteredProducts.length} de {products.length} productos
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowProduct;
