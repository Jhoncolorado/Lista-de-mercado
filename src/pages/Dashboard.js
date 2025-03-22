// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../services/firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { linkEmailPassword, changePassword } from '../services/authServices';

// Componentes de Sprint 1 y 2 (ubicados en src/components)
import StoreSelector from '../components/StoreSelector';
import CategoryManager from '../components/CategoryManager';
import ProductFilter from '../components/ProductFilter';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import BulkCalculator from '../components/BulkCalculator';
import PriceComparison from '../components/PriceComparison';

// Funciones para interactuar con Firestore
import { addProductToFirestore, updateProductInFirestore } from '../services/productService';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStores: 0,
    totalCategories: 0,
    recentProducts: []
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      const q = query(collection(db, "productos"), where("active", "==", true));
      const querySnapshot = await getDocs(q);
      const products = [];
      const stores = new Set();
      const categories = new Set();

      querySnapshot.forEach(doc => {
        const product = doc.data();
        products.push({ id: doc.id, ...product });
        if (product.store) stores.add(product.store);
        if (product.category) categories.add(product.category);
      });

      setStats({
        totalProducts: products.length,
        totalStores: stores.size,
        totalCategories: categories.size,
        recentProducts: products.slice(-5)
      });
    };

    fetchStats();
  }, []);

  const handlePasswordAction = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }
    if (password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres');
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      // Siempre usamos changePassword ya que el usuario ya tiene una cuenta
      await changePassword(password);
      setSuccess('¡Contraseña actualizada exitosamente! Ahora podrás usar esta contraseña para iniciar sesión.');
      
      setShowPasswordForm(false);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error:', err);
      if (err.message.includes('volver a iniciar sesión')) {
        setError('Por seguridad, necesitas volver a iniciar sesión antes de cambiar tu contraseña. Por favor:\n1. Cierra sesión\n2. Vuelve a entrar con Google\n3. Intenta cambiar la contraseña nuevamente');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      title: "Gestión de Productos",
      description: "Agregar, editar y organizar tus productos",
      icon: "📦",
      link: "/products"
    },
    {
      title: "Análisis de Precios",
      description: "Compara precios y analiza tendencias",
      icon: "📊",
      link: "/price-analysis"
    },
    {
      title: "Gestión de Tiendas",
      description: "Administra tus tiendas favoritas",
      icon: "🏪",
      link: "/stores"
    },
    {
      title: "Categorías",
      description: "Organiza tus productos por categorías",
      icon: "🏷️",
      link: "/categories"
    }
  ];

  return (
    <div className="dashboard fade-in">
      {/* Encabezado con saludo y estadísticas */}
      <div className="welcome-section">
        <h2>Bienvenido, {currentUser?.email}</h2>
        <div className="stats-overview">
          <div className="stat-box">
            <h3>{stats.totalProducts}</h3>
            <p>Productos</p>
          </div>
          <div className="stat-box">
            <h3>{stats.totalStores}</h3>
            <p>Tiendas</p>
          </div>
          <div className="stat-box">
            <h3>{stats.totalCategories}</h3>
            <p>Categorías</p>
          </div>
        </div>
      </div>

      {/* Configuración de cuenta */}
      <div className="account-settings">
        <h3>Configuración de Cuenta</h3>
        {!showPasswordForm ? (
          <button 
            className="btn btn-primary"
            onClick={() => {
              setShowPasswordForm(true);
              setError('');
              setSuccess('');
            }}
          >
            Establecer Contraseña para Inicio de Sesión
          </button>
        ) : (
          <div className="password-form">
            {error && <div className="alert alert-danger" style={{ whiteSpace: 'pre-line' }}>{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handlePasswordAction}>
              <div className="form-group">
                <label>Nueva Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength="6"
                  placeholder="Ingresa tu nueva contraseña"
                />
              </div>
              <div className="form-group">
                <label>Confirmar Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength="6"
                  placeholder="Confirma tu nueva contraseña"
                />
              </div>
              <div className="button-group">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : 'Establecer Contraseña'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setError('');
                    setSuccess('');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Menú principal */}
      <div className="menu-grid">
        {menuItems.map((item, index) => (
          <Link to={item.link} key={index} className="menu-card">
            <div className="menu-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>

      {/* Productos recientes */}
      <div className="recent-products">
        <h3>Productos Recientes</h3>
        <div className="products-list">
          {stats.recentProducts.map((product, index) => (
            <div key={index} className="product-card">
              <h4>{product.name}</h4>
              <p>{product.brand}</p>
              <p className="price">${product.price}</p>
              <span className="store-badge">{product.store || 'Sin tienda'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



