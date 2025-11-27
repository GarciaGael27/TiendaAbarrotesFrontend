import React, { useState, useEffect } from "react";
import StatCard from "../components/Estadistics";
import { BoxIcon, ShoppingCartIcon, DollarSignIcon, UsersIcon } from "../components/Icons";
import '../styles/pages/Dashboard.css';
import comestiblesService from '../services/ComestiblesService';
import limpiezaService from '../services/limpiezaService';
import ropaService from '../services/ropaService';
import ventaService from '../services/ventaService';
import empleadoService from '../services/empleadoService';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalProductos: 0,
    ventasHoy: 0,
    ingresosDelMes: 0,
    empleadosActivos: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar todas las estadísticas
  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Hacer llamadas paralelas a todos los servicios
      const [comestibles, limpieza, ropa, ventas, empleados] = await Promise.allSettled([
        comestiblesService.getAll(),
        limpiezaService.getAll(),
        ropaService.getAll(),
        ventaService.getAll(),
        empleadoService.getAll()
      ]);

      // Calcular total de productos
      let totalProductos = 0;
      if (comestibles.status === 'fulfilled' && comestibles.value) {
        totalProductos += comestibles.value.length;
      }
      if (limpieza.status === 'fulfilled' && limpieza.value) {
        totalProductos += limpieza.value.length;
      }
      if (ropa.status === 'fulfilled' && ropa.value) {
        totalProductos += ropa.value.length;
      }

      // Calcular ventas de hoy
      let ventasHoy = 0;
      let ingresosDelMes = 0;
      if (ventas.status === 'fulfilled' && ventas.value) {
        const today = new Date().toISOString().split('T')[0];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        ventas.value.forEach(venta => {
          const ventaDate = new Date(venta.fecha);
          
          // Ventas de hoy
          if (venta.fecha === today) {
            ventasHoy++;
          }
          
          // Ingresos del mes actual
          if (ventaDate.getMonth() === currentMonth && ventaDate.getFullYear() === currentYear) {
            ingresosDelMes += parseFloat(venta.total || 0);
          }
        });
      }

      // Calcular empleados activos
      let empleadosActivos = 0;
      if (empleados.status === 'fulfilled' && empleados.value) {
        empleadosActivos = empleados.value.length;
      }

      setStats({
        totalProductos,
        ventasHoy,
        ingresosDelMes,
        empleadosActivos
      });

    } catch (err) {
      console.error('Error loading statistics:', err);
      setError('Error al cargar las estadísticas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  // Datos para las tarjetas de estadísticas
  const statsData = [
    {
      title: "Total Productos",
      value: loading ? "..." : stats.totalProductos.toString(),
      icon: <BoxIcon size={24} />,
      color: "primary"
    },
    {
      title: "Ventas Hoy",
      value: loading ? "..." : stats.ventasHoy.toString(),
      icon: <ShoppingCartIcon size={24} />,
      color: "success"
    },
    {
      title: "Ingresos del Mes",
      value: loading ? "..." : `$${stats.ingresosDelMes.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
      icon: <DollarSignIcon size={24} />,
      color: "warning"
    },
    {
      title: "Empleados Activos",
      value: loading ? "..." : stats.empleadosActivos.toString(),
      icon: <UsersIcon size={24} />,
      color: "info"
    },
    {
      title: "Última actualización",
      value: new Date().toLocaleString('es-MX'),
      icon: <BoxIcon size={24} />,
      color: "secondary"
    }
  ];

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard__header">
          <h1 className="dashboard__title">Tienda de Abarrotes</h1>
          <p className="dashboard__subtitle">Panel de Control</p>
        </div>
        <div className="error-message" style={{
          textAlign: 'center',
          padding: '40px',
          color: '#dc3545',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <p>{error}</p>
          <button 
            onClick={loadStatistics}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Tienda de Abarrotes</h1>
        <p className="dashboard__subtitle">
          {loading ? "Cargando estadísticas..." : "Estadísticas Generales"}
        </p>
      </div>
      
      <div className="dashboard__stats">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {!loading && (
        <div className="dashboard__info" style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Resumen del Sistema</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <strong>Productos por Categoría:</strong>
              <div style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '5px' }}>
                • Comestibles: En inventario<br/>
                • Limpieza: En inventario<br/>
                • Ropa: En inventario
              </div>
            </div>
            <div>
              <strong>Última actualización:</strong>
              <div style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '5px' }}>
                {new Date().toLocaleString('es-MX')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;