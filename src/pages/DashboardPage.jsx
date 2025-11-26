import React from "react";
import StatCard from "../components/Estadistics";
import { BoxIcon, ShoppingCartIcon, DollarSignIcon, UsersIcon } from "../components/Icons";
import '../styles/pages/Dashboard.css';

const DashboardPage = () => {
  // Datos simulados - en el futuro vendrán del backend
  const statsData = [
    {
      title: "Total Productos",
      value: "5",
      icon: <BoxIcon size={24} />,
      color: "primary"
    },
    {
      title: "Ventas Hoy",
      value: "23",
      icon: <ShoppingCartIcon size={24} />,
      color: "success"
    },
    {
      title: "Ingresos del Mes",
      value: "$12,340",
      icon: <DollarSignIcon size={24} />,
      color: "warning"
    },
    {
      title: "Clientes Activos",
      value: "89",
      icon: <UsersIcon size={24} />,
      color: "info"
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Tienda de Abarrotes</h1>
        <p className="dashboard__subtitle">Estadísticas Generales</p>
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
    </div>
  );
}

export default DashboardPage;