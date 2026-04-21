import React, { useState, useEffect } from 'react';
import { SearchIcon, EditIcon, DeleteIcon, BoxIcon, CloseIcon } from '../components/Icons';
import '../styles/pages/ShowProduct.css';
import comestiblesService from '../services/ComestiblesService';
import limpiezaService from '../services/limpiezaService';
import ropaService from '../services/ropaService';

const ShowProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Estados para eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Función para cargar todos los productos de todas las categorías
  const loadAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Hacer llamadas paralelas a todos los servicios
      const [comestibles, limpieza, ropa] = await Promise.allSettled([
        comestiblesService.getAll(),
        limpiezaService.getAll(),
        ropaService.getAll()
      ]);

      let allProducts = [];

      // Procesar comestibles
      if (comestibles.status === 'fulfilled' && comestibles.value) {
        const comestiblesWithCategory = comestibles.value.map(item => ({
          id: item.codigo_visual,
          codigo_visual: item.codigo_visual,
          nombre: item.nombre,
          categoria: 'Comestibles',
          precio: parseFloat(item.precio) || 0,
          stock: parseInt(item.cantidad) || 0,
          marca: item.marca,
          fecha_caducidad: item.fecha_caducidad,
          tipo: item.tipo,
          porcion: item.porcion
        }));
        allProducts = [...allProducts, ...comestiblesWithCategory];
      }

      // Procesar productos de limpieza
      if (limpieza.status === 'fulfilled' && limpieza.value) {
        const limpiezaWithCategory = limpieza.value.map(item => ({
          id: item.codigo_visual,
          codigo_visual: item.codigo_visual,
          nombre: item.nombre,
          categoria: 'Limpieza',
          precio: parseFloat(item.precio) || 0,
          stock: parseInt(item.cantidad) || 0,
          marca: item.marca,
          uso: item.uso,
          porcion: item.porcion
        }));
        allProducts = [...allProducts, ...limpiezaWithCategory];
      }

      // Procesar ropa
      if (ropa.status === 'fulfilled' && ropa.value) {
        const ropaWithCategory = ropa.value.map(item => ({
          id: item.codigo_visual,
          codigo_visual: item.codigo_visual,
          nombre: item.nombre,
          categoria: 'Ropa',
          precio: parseFloat(item.precio) || 0,
          stock: parseInt(item.cantidad) || 0,
          marca: item.marca,
          tipo_tela: item.tipo_tela,
          talla: item.talla,
          tipo: item.tipo,
          color: item.color,
          genero: item.genero
        }));
        allProducts = [...allProducts, ...ropaWithCategory];
      }

      setProducts(allProducts);
      setFilteredProducts(allProducts);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Error al cargar los productos. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllProducts();
  }, []);

  useEffect(() => {
    // Filtrar productos basado en el término de búsqueda
    const filtered = products.filter(product =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.marca.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleEdit = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setEditingProduct(product);
      setEditFormData({
        codigo_visual: product.codigo_visual,
        nombre: product.nombre,
        marca: product.marca,
        precio: product.precio,
        stock: product.stock,
        // Campos específicos por categoría
        ...(product.categoria === 'Comestibles' && {
          tipo: product.tipo || '',
          fecha_caducidad: product.fecha_caducidad || '',
          porcion: product.porcion || ''
        }),
        ...(product.categoria === 'Limpieza' && {
          uso: product.uso || '',
          porcion: product.porcion || ''
        }),
        ...(product.categoria === 'Ropa' && {
          tipo_tela: product.tipo_tela || '',
          talla: product.talla || '',
          tipo: product.tipo || '',
          color: product.color || '',
          genero: product.genero || ''
        })
      });
      setIsEditModalOpen(true);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    if (!editingProduct) return;

    setIsUpdating(true);
    try {
      let updateSuccess = false;
      const updateData = {
        ...editFormData,
        cantidad: editFormData.stock // El backend espera 'cantidad' en lugar de 'stock'
      };

      // Determinar qué servicio usar basado en la categoría
      switch (editingProduct.categoria) {
        case 'Comestibles':
          await comestiblesService.update(editingProduct.codigo_visual, updateData);
          updateSuccess = true;
          break;
        case 'Limpieza':
          await limpiezaService.update(editingProduct.codigo_visual, updateData);
          updateSuccess = true;
          break;
        case 'Ropa':
          await ropaService.update(editingProduct.codigo_visual, updateData);
          updateSuccess = true;
          break;
        default:
          throw new Error('Categoría no reconocida');
      }

      if (updateSuccess) {
        // Actualizar la lista local de productos
        const updatedProducts = products.map(p => 
          p.id === editingProduct.id 
            ? { ...p, ...editFormData, stock: editFormData.stock }
            : p
        );
        setProducts(updatedProducts);
        
        // Actualizar productos filtrados
        const updatedFiltered = updatedProducts.filter(product =>
          product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.marca.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(updatedFiltered);
        
        // Cerrar modal
        setIsEditModalOpen(false);
        setEditingProduct(null);
        setEditFormData({});
        
        alert('Producto actualizado exitosamente');
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      alert('Error al actualizar el producto. Intenta nuevamente.');
    } finally {
      setIsUpdating(false);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setEditFormData({});
  };

  const handleDelete = async (product) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;

    try {
      let deleteSuccess = false;

      // Determinar qué servicio usar basado en la categoría
      switch (deletingProduct.categoria) {
        case 'Comestibles':
          await comestiblesService.delete(deletingProduct.codigo_visual);
          deleteSuccess = true;
          break;
        case 'Limpieza':
          await limpiezaService.delete(deletingProduct.codigo_visual);
          deleteSuccess = true;
          break;
        case 'Ropa':
          await ropaService.delete(deletingProduct.codigo_visual);
          deleteSuccess = true;
          break;
        default:
          alert('Categoría no reconocida');
          return;
      }

      if (deleteSuccess) {
        // Actualizar la lista de productos localmente
        const updatedProducts = products.filter(p => p.id !== deletingProduct.id);
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts.filter(p =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.marca.toLowerCase().includes(searchTerm.toLowerCase())
        ));
        
        setIsDeleteModalOpen(false);
        setDeletingProduct(null);
        alert('Producto eliminado exitosamente');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto. Intenta nuevamente.');
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingProduct(null);
  };

  const getStockStatus = (stock) => {
    if (stock > 30) return 'disponible';
    if (stock > 10) return 'medio';
    return 'bajo';
  };

  const getStockStatusText = (stock) => {
    if (stock > 30) return 'Disponible';
    if (stock > 10) return 'Stock Medio';
    return 'Stock Bajo';
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
          {loading ? (
            <div className="loading-message">
              <p>Cargando productos...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={loadAllProducts} className="retry-btn">
                Intentar nuevamente
              </button>
            </div>
          ) : (
            <>
              {/* Tabla para pantallas grandes */}
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Marca</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Detalles</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="product-code">{product.codigo_visual}</td>
                      <td className="product-name">{product.nombre}</td>
                      <td className="product-category">{product.categoria}</td>
                      <td className="product-brand">{product.marca}</td>
                      <td className="product-price">${parseFloat(product.precio || 0).toFixed(2)}</td>
                      <td className="product-stock">
                        <span className="stock-number">{product.stock}</span>
                        <span className={`stock-badge stock-badge--${getStockStatus(product.stock)}`}>
                          {getStockStatusText(product.stock)}
                        </span>
                      </td>
                      <td className="product-details">
                        {product.categoria === 'Comestibles' && (
                          <div>
                            <span className="detail-item">
                              <span className="detail-label">Tipo:</span>
                              <span className="detail-value">{product.tipo || 'N/A'}</span>
                            </span>
                            <span className="detail-item">
                              <span className="detail-label">Vencimiento:</span>
                              <span className="detail-value">{product.fecha_caducidad || 'N/A'}</span>
                            </span>
                            <span className="detail-item">
                              <span className="detail-label">Porción:</span>
                              <span className="detail-value">{product.porcion || 'N/A'}</span>
                            </span>
                          </div>
                        )}
                        {product.categoria === 'Limpieza' && (
                          <div>
                            <span className="detail-item">
                              <span className="detail-label">Uso:</span>
                              <span className="detail-value">{product.uso || 'N/A'}</span>
                            </span>
                            <span className="detail-item">
                              <span className="detail-label">Porción:</span>
                              <span className="detail-value">{product.porcion || 'N/A'}</span>
                            </span>
                          </div>
                        )}
                        {product.categoria === 'Ropa' && (
                          <div>
                            <span className="detail-item">
                              <span className="detail-label">Talla:</span>
                              <span className="detail-value">{product.talla || 'N/A'}</span>
                            </span>
                            <span className="detail-item">
                              <span className="detail-label">Color:</span>
                              <span className="detail-value">{product.color || 'N/A'}</span>
                            </span>
                            <span className="detail-item">
                              <span className="detail-label">Género:</span>
                              <span className="detail-value">{product.genero || 'N/A'}</span>
                            </span>
                            <span className="detail-item">
                              <span className="detail-label">Material:</span>
                              <span className="detail-value">{product.tipo_tela || 'N/A'}</span>
                            </span>
                          </div>
                        )}
                      </td>
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
                          onClick={() => handleDelete(product)}
                          title="Eliminar producto"
                        >
                          <DeleteIcon size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="no-products">
              <p>No se encontraron productos que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>

        {/* Vista móvil para pantallas pequeñas */}
        <div className="products-mobile-view">
          {loading ? (
            <div className="loading-message">
              <p>Cargando productos...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={loadAllProducts} className="retry-btn">
                Intentar nuevamente
              </button>
            </div>
          ) : (
            <>
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card-mobile">
                  <div className="mobile-card-header">
                    <h3 className="mobile-card-title">{product.nombre}</h3>
                    <div className="mobile-card-actions">
                      <button
                        className="action-btn action-btn--edit"
                        onClick={() => handleEdit(product.id)}
                        title="Editar producto"
                      >
                        <EditIcon size={16} />
                      </button>
                      <button
                        className="action-btn action-btn--delete"
                        onClick={() => handleDelete(product)}
                        title="Eliminar producto"
                      >
                        <DeleteIcon size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mobile-card-body">
                    <div className="mobile-card-field">
                      <span className="mobile-field-label">Código</span>
                      <span className="mobile-field-value">{product.codigo_visual}</span>
                    </div>
                    <div className="mobile-card-field">
                      <span className="mobile-field-label">Categoría</span>
                      <span className="mobile-field-value">{product.categoria}</span>
                    </div>
                    <div className="mobile-card-field">
                      <span className="mobile-field-label">Marca</span>
                      <span className="mobile-field-value">{product.marca}</span>
                    </div>
                    <div className="mobile-card-field">
                      <span className="mobile-field-label">Precio</span>
                      <span className="mobile-field-value">${parseFloat(product.precio || 0).toFixed(2)}</span>
                    </div>
                    <div className="mobile-card-field">
                      <span className="mobile-field-label">Stock</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="mobile-field-value">{product.stock}</span>
                        <span className={`stock-badge stock-badge--${getStockStatus(product.stock)}`}>
                          {getStockStatusText(product.stock)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mobile-card-details">
                    <h4 className="mobile-details-title">Detalles Adicionales</h4>
                    <div className="mobile-details-grid">
                      {product.categoria === 'Comestibles' && (
                        <>
                          <div className="mobile-detail-item">
                            <span className="mobile-detail-label">Tipo:</span>
                            {product.tipo || 'N/A'}
                          </div>
                          <div className="mobile-detail-item">
                            <span className="mobile-detail-label">Vencimiento:</span>
                            {product.fecha_caducidad || 'N/A'}
                          </div>
                          <div className="mobile-detail-item">
                            <span className="mobile-detail-label">Porción:</span>
                            {product.porcion || 'N/A'}
                          </div>
                        </>
                      )}
                      {product.categoria === 'Limpieza' && (
                        <>
                          <div className="mobile-detail-item">
                            <span className="mobile-detail-label">Uso:</span>
                            {product.uso || 'N/A'}
                          </div>
                          <div className="mobile-detail-item">
                            <span className="mobile-detail-label">Porción:</span>
                            {product.porcion || 'N/A'}
                          </div>
                        </>
                      )}
                      {product.categoria === 'Ropa' && (
                        <>
                          <div className="mobile-detail-item">
                            <span className="mobile-detail-label">Talla:</span>
                            {product.talla || 'N/A'}
                          </div>
                          <div className="mobile-detail-item">
                            <span className="mobile-detail-label">Color:</span>
                            {product.color || 'N/A'}
                          </div>
                          <div className="mobile-detail-item">
                            <span className="mobile-detail-label">Género:</span>
                            {product.genero || 'N/A'}
                          </div>
                          <div className="mobile-detail-item">
                            <span className="mobile-detail-label">Material:</span>
                            {product.tipo_tela || 'N/A'}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {!loading && !error && filteredProducts.length === 0 && (
                <div className="no-products">
                  <p>No se encontraron productos que coincidan con tu búsqueda.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination (for future implementation) */}
        <div className="show-product__pagination">
          <div className="pagination-info">
            Mostrando {filteredProducts.length} de {products.length} productos
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {isEditModalOpen && editingProduct && (
        <div className="edit-modal-overlay" onClick={closeEditModal}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal__header">
              <h2 className="edit-modal__title">
                <EditIcon size={24} />
                Editar Producto
              </h2>
              <button className="edit-modal__close" onClick={closeEditModal}>
                <CloseIcon size={20} />
              </button>
            </div>
            
            <form className="edit-form" onSubmit={handleUpdateProduct}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="codigo_visual">Código Visual</label>
                  <input
                    type="text"
                    id="codigo_visual"
                    name="codigo_visual"
                    value={editFormData.codigo_visual || ''}
                    onChange={handleEditFormChange}
                    required
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="nombre">Nombre del Producto</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={editFormData.nombre || ''}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="marca">Marca</label>
                  <input
                    type="text"
                    id="marca"
                    name="marca"
                    value={editFormData.marca || ''}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="precio">Precio</label>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    value={editFormData.precio || ''}
                    onChange={handleEditFormChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock/Cantidad</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={editFormData.stock || ''}
                  onChange={handleEditFormChange}
                  min="0"
                  required
                />
              </div>

              {/* Campos específicos por categoría */}
              {editingProduct.categoria === 'Comestibles' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="tipo">Tipo</label>
                      <input
                        type="text"
                        id="tipo"
                        name="tipo"
                        value={editFormData.tipo || ''}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="fecha_caducidad">Fecha de Caducidad</label>
                      <input
                        type="date"
                        id="fecha_caducidad"
                        name="fecha_caducidad"
                        value={editFormData.fecha_caducidad || ''}
                        onChange={handleEditFormChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="porcion">Porción</label>
                    <input
                      type="text"
                      id="porcion"
                      name="porcion"
                      value={editFormData.porcion || ''}
                      onChange={handleEditFormChange}
                    />
                  </div>
                </>
              )}

              {editingProduct.categoria === 'Limpieza' && (
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="uso">Uso</label>
                    <input
                      type="text"
                      id="uso"
                      name="uso"
                      value={editFormData.uso || ''}
                      onChange={handleEditFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="porcion">Porción</label>
                    <input
                      type="text"
                      id="porcion"
                      name="porcion"
                      value={editFormData.porcion || ''}
                      onChange={handleEditFormChange}
                    />
                  </div>
                </div>
              )}

              {editingProduct.categoria === 'Ropa' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="talla">Talla</label>
                      <input
                        type="text"
                        id="talla"
                        name="talla"
                        value={editFormData.talla || ''}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="color">Color</label>
                      <input
                        type="text"
                        id="color"
                        name="color"
                        value={editFormData.color || ''}
                        onChange={handleEditFormChange}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="genero">Género</label>
                      <select
                        id="genero"
                        name="genero"
                        value={editFormData.genero || ''}
                        onChange={handleEditFormChange}
                      >
                        <option value="">Seleccionar</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="tipo_tela">Material/Tipo de Tela</label>
                      <input
                        type="text"
                        id="tipo_tela"
                        name="tipo_tela"
                        value={editFormData.tipo_tela || ''}
                        onChange={handleEditFormChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="tipo">Tipo de Prenda</label>
                    <input
                      type="text"
                      id="tipo"
                      name="tipo"
                      value={editFormData.tipo || ''}
                      onChange={handleEditFormChange}
                    />
                  </div>
                </>
              )}

              <div className="form-actions">
                <button type="button" className="btn btn--secondary" onClick={closeEditModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn--primary" disabled={isUpdating}>
                  {isUpdating ? 'Actualizando...' : 'Actualizar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {isDeleteModalOpen && deletingProduct && (
        <div className="edit-modal-overlay" onClick={cancelDelete}>
          <div className="delete-confirmation" onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirmation__icon">
              <DeleteIcon size={32} />
            </div>
            <h3 className="delete-confirmation__title">¿Eliminar Producto?</h3>
            <p className="delete-confirmation__message">
              Esta acción no se puede deshacer. El producto será eliminado permanentemente del inventario.
            </p>
            <div className="delete-confirmation__product">
              <strong>{deletingProduct.nombre}</strong><br />
              Código: {deletingProduct.codigo_visual}
            </div>
            <div className="delete-confirmation__actions">
              <button className="btn btn--secondary" onClick={cancelDelete}>
                Cancelar
              </button>
              <button className="btn btn--danger" onClick={confirmDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowProduct;
