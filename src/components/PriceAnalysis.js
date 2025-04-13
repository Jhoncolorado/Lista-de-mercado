import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

const PriceAnalysis = () => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [previousMonth, setPreviousMonth] = useState(format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM'));
  const [priceComparisons, setPriceComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [selectedMonth, previousMonth]);

  const initializePriceHistory = async (products) => {
    for (const product of products) {
      if (!product.priceHistory) {
        const productRef = doc(db, "productos", product.id);
        await updateDoc(productRef, {
          priceHistory: [{
            date: product.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
            price: product.price
          }]
        });
      }
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Convertir las fechas seleccionadas a objetos Date
      const currentMonthDate = new Date(selectedMonth + '-01');
      const previousMonthDate = new Date(previousMonth + '-01');

      // Obtener todos los productos activos
      const productsQuery = query(
        collection(db, "productos"),
        where("active", "==", true)
      );

      const snapshot = await getDocs(productsQuery);
      const products = [];
      
      snapshot.forEach(doc => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Inicializar historial de precios si es necesario
      await initializePriceHistory(products);

      // Procesar los productos para la comparación
      const comparisons = [];
      for (const product of products) {
        const priceHistory = product.priceHistory || [];
        
        // Encontrar el precio más reciente para el mes seleccionado
        const currentMonthPrice = priceHistory.find(ph => {
          const priceDate = new Date(ph.date);
          return priceDate.getMonth() === currentMonthDate.getMonth() &&
                 priceDate.getFullYear() === currentMonthDate.getFullYear();
        });

        // Encontrar el precio más reciente para el mes anterior
        const previousMonthPrice = priceHistory.find(ph => {
          const priceDate = new Date(ph.date);
          return priceDate.getMonth() === previousMonthDate.getMonth() &&
                 priceDate.getFullYear() === previousMonthDate.getFullYear();
        });

        // Si no hay precio para el mes actual, usar el precio actual del producto
        const currentPrice = currentMonthPrice ? currentMonthPrice.price : product.price;
        const previousPrice = previousMonthPrice ? previousMonthPrice.price : null;

        if (previousPrice !== null) {
          const priceDiff = currentPrice - previousPrice;
          const percentChange = ((priceDiff / previousPrice) * 100).toFixed(2);

          comparisons.push({
            id: product.id,
            name: product.name,
            store: product.store || 'No especificada',
            currentPrice: currentPrice,
            previousPrice: previousPrice,
            difference: priceDiff,
            percentChange: percentChange,
            trend: priceDiff > 0 ? 'increase' : priceDiff < 0 ? 'decrease' : 'stable'
          });
        }
      }

      // Ordenar comparaciones por diferencia de precio (valor absoluto)
      comparisons.sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));
      setPriceComparisons(comparisons);
    } catch (err) {
      console.error('Error al obtener datos:', err);
      setError('Error al cargar los datos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="price-analysis">
      <div className="analysis-header">
        <h2>ANÁLISIS DE PRECIOS</h2>
        <div className="month-selectors">
          <div className="form-group">
            <label>Mes Actual:</label>
            <input
              type="month"
              className="form-control"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Mes Anterior:</label>
            <input
              type="month"
              className="form-control"
              value={previousMonth}
              onChange={(e) => setPreviousMonth(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="comparison-section">
        <h3>COMPARACIÓN DE PRECIOS</h3>
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Tienda</th>
                <th>Precio Actual</th>
                <th>Precio Anterior</th>
                <th>Diferencia</th>
                <th>Variación</th>
              </tr>
            </thead>
            <tbody>
              {priceComparisons.length > 0 ? (
                priceComparisons.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.store}</td>
                    <td>{formatCurrency(item.currentPrice)}</td>
                    <td>{formatCurrency(item.previousPrice)}</td>
                    <td className={item.trend === 'increase' ? 'price-increase' : 'price-decrease'}>
                      {formatCurrency(item.difference)}
                    </td>
                    <td className={item.trend === 'increase' ? 'price-increase' : 'price-decrease'}>
                      {item.percentChange}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No hay datos para comparar en los meses seleccionados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PriceAnalysis; 