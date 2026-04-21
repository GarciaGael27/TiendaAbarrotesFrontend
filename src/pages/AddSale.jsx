import React, { useState, useEffect } from "react";
import { SearchIcon, ShoppingCartIcon, PlusIcon, MinusIcon, DeleteIcon } from "../components/Icons";
import '../styles/pages/AddSale.css';
import comestiblesService from '../services/ComestiblesService';
import limpiezaService from '../services/limpiezaService';
import ropaService from '../services/ropaService';
import ventaService from '../services/ventaService';
import empleadoService from '../services/empleadoService';

const AddSale = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saleLoading, setSaleLoading] = useState(false);
  
  // Estados para empleados
  const [empleados, setEmpleados] = useState([]);
  const [empleadosLoading, setEmpleadosLoading] = useState(false);
  
  // Datos de la venta
  const [saleData, setSaleData] = useState({
    empleado_seleccionado: '', 
    curp_empleado: '',
    nombre_empleado: '',
    fecha: new Date().toISOString().split('T')[0]
  });

  // Cargar todos los productos
  const loadAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const [comestibles, limpieza, ropa] = await Promise.allSettled([
        comestiblesService.getAll(),
        limpiezaService.getAll(),
        ropaService.getAll()
      ]);

      let allProducts = [];

      if (comestibles.status === 'fulfilled' && comestibles.value) {
        const comestiblesWithCategory = comestibles.value.map(item => ({
          id: item.codigo_visual,
          codigo_visual: item.codigo_visual,
          nombre: item.nombre,
          categoria: 'Comestibles',
          precio: parseFloat(item.precio) || 0,
          stock: parseInt(item.cantidad) || 0,
          marca: item.marca
        }));
        allProducts = [...allProducts, ...comestiblesWithCategory];
      }

      if (limpieza.status === 'fulfilled' && limpieza.value) {
        const limpiezaWithCategory = limpieza.value.map(item => ({
          id: item.codigo_visual,
          codigo_visual: item.codigo_visual,
          nombre: item.nombre,
          categoria: 'Limpieza',
          precio: parseFloat(item.precio) || 0,
          stock: parseInt(item.cantidad) || 0,
          marca: item.marca
        }));
        allProducts = [...allProducts, ...limpiezaWithCategory];
      }

      if (ropa.status === 'fulfilled' && ropa.value) {
        const ropaWithCategory = ropa.value.map(item => ({
          id: item.codigo_visual,
          codigo_visual: item.codigo_visual,
          nombre: item.nombre,
          categoria: 'Ropa',
          precio: parseFloat(item.precio) || 0,
          stock: parseInt(item.cantidad) || 0,
          marca: item.marca
        }));
        allProducts = [...allProducts, ...ropaWithCategory];
      }

      setProducts(allProducts);
      setFilteredProducts(allProducts);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Error al cargar los productos.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar empleados disponibles
  const loadEmpleados = async () => {
    try {
      setEmpleadosLoading(true);
      const response = await empleadoService.getAll();
      if (response && Array.isArray(response)) {
        setEmpleados(response);
      } else {
        setEmpleados([]);
      }
    } catch (err) {
      console.error('Error loading empleados:', err);
      setEmpleados([]);
    } finally {
      setEmpleadosLoading(false);
    }
  };

  useEffect(() => {
    loadAllProducts();
    loadEmpleados(); 
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.marca.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const formatEmpleadoName = (empleado) => {
    if (!empleado) return 'Sin nombre';
    
    if (typeof empleado.nombre === 'object' && empleado.nombre !== null) {
      const nombre = empleado.nombre.nombre || '';
      const apellidoPaterno = empleado.nombre.apellido_paterno || '';
      const apellidoMaterno = empleado.nombre.apellido_materno || '';
      return `${nombre} ${apellidoPaterno} ${apellidoMaterno}`.trim() || 'Sin nombre';
    }
    
    if (typeof empleado.nombre === 'string' && empleado.nombre.trim()) {
      return empleado.nombre.trim();
    }
    
    if (empleado.nombre_completo && typeof empleado.nombre_completo === 'string') {
      return empleado.nombre_completo.trim();
    }
    
    if (empleado.nombre || empleado.apellido_paterno || empleado.apellido_materno) {
      const nombre = empleado.nombre || '';
      const apellidoPaterno = empleado.apellido_paterno || '';
      const apellidoMaterno = empleado.apellido_materno || '';
      return `${nombre} ${apellidoPaterno} ${apellidoMaterno}`.trim() || 'Sin nombre';
    }
    
    return 'Sin nombre';
  };

  // Manejar selección de empleado
  const handleEmpleadoChange = (e) => {
    const selectedIndex = e.target.value;
    
    if (selectedIndex && empleados[selectedIndex]) {
      const empleadoSeleccionado = empleados[selectedIndex];
      const nombreCompleto = formatEmpleadoName(empleadoSeleccionado);
      
      setSaleData(prev => ({
        ...prev,
        empleado_seleccionado: selectedIndex,
        curp_empleado: empleadoSeleccionado.curp || '',
        nombre_empleado: nombreCompleto
      }));
    } else {
      setSaleData(prev => ({
        ...prev,
        empleado_seleccionado: '',
        curp_empleado: '',
        nombre_empleado: ''
      }));
    }
  };

  // Funciones del carrito
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.cantidad < product.stock) {
        setCartItems(cartItems.map(item =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        ));
      }
    } else {
      if (product.stock > 0) {
        setCartItems([...cartItems, { ...product, cantidad: 1 }]);
      }
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (newQuantity <= product.stock) {
      setCartItems(cartItems.map(item =>
        item.id === productId
          ? { ...item, cantidad: newQuantity }
          : item
      ));
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const precio = parseFloat(item.precio || 0);
      const cantidad = parseInt(item.cantidad || 0);
      return total + (precio * cantidad);
    }, 0);
  };

  const handleSaleDataChange = (e) => {
    const { name, value } = e.target;
    setSaleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitSale = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Agrega productos al carrito antes de realizar la venta.');
      return;
    }

    if (!saleData.empleado_seleccionado || !saleData.curp_empleado || !saleData.nombre_empleado) {
      alert('Selecciona un empleado/cajero para procesar la venta.');
      return;
    }

    // Validación adicional de datos
    if (!saleData.fecha) {
      alert('La fecha de la venta es requerida.');
      return;
    }

    if (cartItems.length === 0) {
      alert('Agrega productos al carrito antes de realizar la venta.');
      return;
    }

    // Validar que todos los productos tengan códigos válidos
    const productosInvalidos = cartItems.filter(item => 
      !item.codigo_visual || 
      !item.nombre || 
      !item.precio || 
      item.cantidad <= 0
    );

    if (productosInvalidos.length > 0) {
      console.error('Productos con datos inválidos:', productosInvalidos);
      alert('Algunos productos en el carrito tienen datos inválidos. Revisa la lista.');
      return;
    }

    console.log('Validación inicial exitosa:');
    console.log('- Empleado:', { curp: saleData.curp_empleado, nombre: saleData.nombre_empleado });
    console.log('- Fecha:', saleData.fecha);
    console.log('- Carrito items:', cartItems.length);
    console.log('- Total carrito:', getCartTotal());

    setSaleLoading(true);

    try {
      const ventaData = {
        curp_vendedor: saleData.curp_empleado,
        items: cartItems.map(item => ({
          codigo_visual: item.codigo_visual,
          cantidad: parseInt(item.cantidad || 0)
        }))
      };

      console.log('Datos de venta a enviar (estructura correcta):', ventaData);
      console.log('CURP del vendedor:', ventaData.curp_vendedor);
      console.log('Items a vender:', ventaData.items);

      const response = await ventaService.create(ventaData);
      console.log('Venta creada exitosamente:', response);
      
      setCartItems([]);
      setSaleData({
        empleado_seleccionado: '',
        curp_empleado: '',
        nombre_empleado: '',
        fecha: new Date().toISOString().split('T')[0]
      });
      
      loadAllProducts();
      
      alert('Venta realizada exitosamente!');
    } catch (err) {
      console.error('Error al realizar venta:', err);
      
      let errorMessage = 'Error al procesar la venta.';
      
      if (err.message.includes('400')) {
        errorMessage = 'Error en los datos enviados (400). Revisa que todos los campos estén completos y sean válidos.';
      } else if (err.message.includes('404')) {
        errorMessage = 'Servicio no encontrado (404). Verifica que el servidor esté funcionando.';
      } else if (err.message.includes('500')) {
        errorMessage = 'Error interno del servidor (500). Contacta al administrador.';
      } else if (err.message.includes('fetch')) {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
      }
      
      alert(`${errorMessage}\n\nDetalles técnicos: ${err.message}`);
    } finally {
      setSaleLoading(false);
    }
  };

  return (
    <div className="add-sale">
      <div className="add-sale__container">
        <div className="add-sale__header">
          <h1 className="add-sale__title">
            <ShoppingCartIcon size={24} />
            Registrar Nueva Venta
          </h1>
          <p className="add-sale__subtitle">Selecciona productos y completa la venta</p>
        </div>

        <div className="add-sale__content">
          {/* Sección de productos */}
          <div className="products-section">
            <div className="products-section__header">
              <h2>Productos Disponibles</h2>
              <div className="search-container">
                <SearchIcon size={20} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="loading-message">Cargando productos...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-card__info">
                      <h3 className="product-card__name">{product.nombre}</h3>
                      <p className="product-card__category">{product.categoria}</p>
                      <p className="product-card__brand">{product.marca}</p>
                      <p className="product-card__price">${parseFloat(product.precio || 0).toFixed(2)}</p>
                      <p className="product-card__stock">Stock: {product.stock}</p>
                    </div>
                    <button
                      className="product-card__add-btn"
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <PlusIcon size={16} />
                      Agregar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sección del carrito */}
          <div className="cart-section">
            <div className="cart-section__header">
              <h2>Carrito de Compras</h2>
              <span className="cart-count">({cartItems.length} productos)</span>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <p>El carrito está vacío</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item__info">
                        <h4>{item.nombre}</h4>
                        <p>{item.categoria} - {item.marca}</p>
                        <p>${parseFloat(item.precio || 0).toFixed(2)} c/u</p>
                      </div>
                      <div className="cart-item__quantity">
                        <button
                          onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                          className="quantity-btn"
                        >
                          <MinusIcon size={16} />
                        </button>
                        <span className="quantity">{item.cantidad}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                          className="quantity-btn"
                          disabled={item.cantidad >= item.stock}
                        >
                          <PlusIcon size={16} />
                        </button>
                      </div>
                      <div className="cart-item__total">
                        ${(parseFloat(item.precio || 0) * item.cantidad).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="remove-btn"
                      >
                        <DeleteIcon size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-total">
                  <h3>Total: ${getCartTotal().toFixed(2)}</h3>
                </div>

                {/* Formulario de venta */}
                <form onSubmit={handleSubmitSale} className="sale-form">
                  <div className="form-group">
                    <label htmlFor="empleado_seleccionado">Cajero/Empleado</label>
                    {empleadosLoading ? (
                      <div className="loading-empleados">Cargando empleados...</div>
                    ) : (
                      <select
                        id="empleado_seleccionado"
                        name="empleado_seleccionado"
                        value={saleData.empleado_seleccionado}
                        onChange={handleEmpleadoChange}
                        required
                        className="empleado-select"
                      >
                        <option value="">Selecciona un empleado/cajero</option>
                        {empleados.map((empleado, index) => (
                          <option key={empleado.curp || index} value={index}>
                            {formatEmpleadoName(empleado)}
                            {empleado.curp && ` (${empleado.curp})`}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  
                  {/* Mostrar información del empleado seleccionado */}
                  {saleData.curp_empleado && (
                    <div className="empleado-info">
                      <div className="info-row">
                        <span className="info-label">CURP:</span>
                        <span className="info-value">{saleData.curp_empleado}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Nombre:</span>
                        <span className="info-value">{saleData.nombre_empleado}</span>
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="fecha">Fecha de la Venta</label>
                    <input
                      type="date"
                      id="fecha"
                      name="fecha"
                      value={saleData.fecha}
                      onChange={handleSaleDataChange}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="complete-sale-btn"
                    disabled={saleLoading}
                  >
                    {saleLoading ? 'Procesando...' : 'Completar Venta'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSale;