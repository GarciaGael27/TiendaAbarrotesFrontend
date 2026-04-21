import React from "react";
import '../styles/components/Estadistics.css';

const StatCard = ({ title, value, icon, color = "primary" }) => {
    return (
        <div className={`stat-card stat-card--${color}`}>
            <div className="stat-card__content">
                <div className="stat-card__text">
                    <h3 className="stat-card__title">{title}</h3>
                    <p className="stat-card__value">{value}</p>
                </div>
                <div className="stat-card__icon">
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;