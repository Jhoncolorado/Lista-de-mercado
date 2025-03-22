// src/components/PriceComparison.js
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

const PriceComparison = () => {
  const [priceHistory, setPriceHistory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar lista de productos
  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, "productos"), where("active", "==", true));
      const querySnapshot = await getDocs(q);
      const uniqueProducts = new Set();
      querySnapshot.forEach(doc => {
        const product = doc.data();
        uniqueProducts.add(product.name);
      });
      setProducts(Array.from(uniqueProducts));
    };
    fetchProducts();
  }, []);

  // Obtener historial de precios cuando se selecciona un producto
  useEffect(() => {
    const fetchPriceHistory = async () => {
      if (!selectedProduct) return;
      
      setLoading(true);
      try {
        const q = query(
          collection(db, "productos"),
          where("name", "==", selectedProduct),
          where("active", "==", true)
        );
        const querySnapshot = await getDocs(q);
        
        const history = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          const date = data.createdAt?.toDate();
          if (date) {
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            history.push({
              month: `${month} ${year}`,
              price: parseFloat(data.price),
              store: data.store || 'No especificada'
            });
          }
        });

        // Ordenar por fecha
        history.sort((a, b) => new Date(a.month) - new Date(b.month));
        setPriceHistory(history);
      } catch (error) {
        console.error("Error al obtener historial de precios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceHistory();
  }, [selectedProduct]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ 
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px'
        }}>
          <p className="label">{`Mes: ${label}`}</p>
          <p className="price">{`Precio: $${payload[0].value.toFixed(2)}`}</p>
          <p className="store">{`Tienda: ${payload[0].payload.store}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="price-comparison-container">
      <h3>Comparación de Precios por Mes</h3>
      
      <div className="mb-4">
        <select 
          className="form-control"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">Selecciona un producto</option>
          {products.map(product => (
            <option key={product} value={product}>
              {product}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : priceHistory.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={priceHistory} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis 
                label={{ 
                  value: 'Precio ($)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#00a2ff"
                strokeWidth={2}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
                name="Precio"
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="price-stats mt-4">
            <h4>Estadísticas</h4>
            <div className="row">
              <div className="col-md-4">
                <div className="stat-card">
                  <h5>Precio más bajo</h5>
                  <p>${Math.min(...priceHistory.map(h => h.price)).toFixed(2)}</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card">
                  <h5>Precio más alto</h5>
                  <p>${Math.max(...priceHistory.map(h => h.price)).toFixed(2)}</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card">
                  <h5>Precio promedio</h5>
                  <p>${(priceHistory.reduce((acc, curr) => acc + curr.price, 0) / priceHistory.length).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : selectedProduct ? (
        <div className="alert alert-info">
          No hay datos históricos para este producto.
        </div>
      ) : (
        <div className="alert alert-info">
          Selecciona un producto para ver su historial de precios.
        </div>
      )}
    </div>
  );
};

export default PriceComparison;


