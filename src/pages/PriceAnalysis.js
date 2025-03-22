import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../services/firebaseConfig';
import PriceComparison from '../components/PriceComparison';
import BulkCalculator from '../components/BulkCalculator';

const PriceAnalysis = () => {
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchMonthlyExpenses = async () => {
      try {
        const startOfMonth = new Date(selectedYear, selectedMonth, 1);
        const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

        const q = query(
          collection(db, "productos"),
          where("createdAt", ">=", startOfMonth),
          where("createdAt", "<=", endOfMonth)
        );

        const querySnapshot = await getDocs(q);
        let total = 0;
        querySnapshot.forEach(doc => {
          const product = doc.data();
          if (product.active !== false) {
            total += parseFloat(product.price || 0);
          }
        });
        setMonthlyExpenses(total);
      } catch (error) {
        console.error("Error al obtener gastos mensuales:", error);
        setMonthlyExpenses(0);
      }
    };

    fetchMonthlyExpenses();
  }, [selectedMonth, selectedYear]);

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <div className="price-analysis-page fade-in">
      <div className="page-header">
        <h2>Análisis de Precios</h2>
      </div>

      <div className="content-section">
        {/* Selector de período */}
        <div className="period-selector">
          <div className="form-group">
            <label>Mes</label>
            <select 
              className="form-control"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Año</label>
            <select 
              className="form-control"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Resumen de gastos */}
        <div className="expenses-summary">
          <div className="stat-card">
            <h4>Gastos del Mes</h4>
            <p className="amount">${monthlyExpenses.toFixed(2)}</p>
            <small>{months[selectedMonth]} {selectedYear}</small>
          </div>
        </div>

        {/* Comparación de precios */}
        <div className="comparison-section">
          <h3>Comparación de Precios</h3>
          <PriceComparison />
        </div>

        {/* Calculadora a granel */}
        <div className="bulk-calculator-section">
          <h3>Calculadora de Compras a Granel</h3>
          <BulkCalculator />
        </div>
      </div>
    </div>
  );
};

export default PriceAnalysis; 