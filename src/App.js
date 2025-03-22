// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import PriceAnalysis from './pages/PriceAnalysis';
import Stores from './pages/Stores';
import Categories from './pages/Categories';
import Contacto from './pages/Contacto';

// Componentes globales
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <Header />
          <main className="main-content">
            <div className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/products" 
                  element={
                    <PrivateRoute>
                      <Products />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/price-analysis" 
                  element={
                    <PrivateRoute>
                      <PriceAnalysis />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/stores" 
                  element={
                    <PrivateRoute>
                      <Stores />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/categories" 
                  element={
                    <PrivateRoute>
                      <Categories />
                    </PrivateRoute>
                  } 
                />
                <Route path="/contacto" element={<Contacto />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;





