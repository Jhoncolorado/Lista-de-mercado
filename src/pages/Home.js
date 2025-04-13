import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaChartLine, FaStore, FaTags } from 'react-icons/fa';

const Home = () => {
  const features = [
    {
      icon: <FaShoppingCart />,
      title: "Gestión de Productos",
      description: "Organiza y administra tu lista de productos de manera eficiente"
    },
    {
      icon: <FaChartLine />,
      title: "Análisis de Precios",
      description: "Compara precios y analiza tendencias para ahorrar en tus compras"
    },
    {
      icon: <FaStore />,
      title: "Gestión de Tiendas",
      description: "Administra múltiples tiendas y compara precios entre ellas"
    },
    {
      icon: <FaTags />,
      title: "Categorización",
      description: "Organiza tus productos por categorías para un mejor control"
    }
  ];

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Gestor de Lista de Mercado</h1>
        <p className="home-subtitle">
          Organiza tus compras, compara precios y gestiona tus productos de forma fácil y rápida.
          La manera inteligente de hacer tus compras.
        </p>
        
        <Link to="/register" className="cta-button">
          Comenzar Ahora
        </Link>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
