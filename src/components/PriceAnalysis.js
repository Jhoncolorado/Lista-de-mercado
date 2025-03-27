import React, { useState, useEffect } from 'react';
import { format, parseISO, isValid, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer
} from 'recharts';

const PriceAnalysis = ({ products }) => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [previousMonth, setPreviousMonth] = useState(format(subMonths(new Date(), 1), 'yyyy-MM'));
  const [monthlyExpenses, setMonthlyExpenses] = useState({});
  const [priceComparisons, setPriceComparisons] = useState([]);
  const [storeExpenses, setStoreExpenses] = useState([]);
  const [categoryExpenses, setCategoryExpenses] = useState([]);
  const [timeRange, setTimeRange] = useState('6'); // 6 meses por defecto

  useEffect(() => {
    if (products) {
      calculateMonthlyExpenses();
      comparePrices();
      calculateStoreExpenses();
      calculateCategoryExpenses();
    }
  }, [products, selectedMonth, previousMonth, timeRange]);

  const getProductDate = (product) => {
    // Si el producto tiene createdAt, intentamos usarlo
    if (product.createdAt) {
      try {
        const date = product.createdAt.toDate ? product.createdAt.toDate() : new Date(product.createdAt);
        return isValid(date) ? date : new Date();
      } catch (error) {
        return new Date();
      }
    }
    // Si no tiene fecha, usamos la fecha actual
    return new Date();
  };

  const calculateMonthlyExpenses = () => {
    const expenses = {};
    const months = [];
    const currentDate = new Date();
    
    // Generar array de meses según el rango seleccionado
    for (let i = 0; i < parseInt(timeRange); i++) {
      const date = subMonths(currentDate, i);
      months.push(format(date, 'yyyy-MM'));
    }

    // Inicializar gastos para todos los meses
    months.forEach(month => {
      expenses[month] = 0;
    });

    // Calcular gastos
    products.forEach(product => {
      if (product.active) {
        const date = getProductDate(product);
        const month = format(date, 'yyyy-MM');
        if (months.includes(month)) {
          expenses[month] += product.price;
        }
      }
    });

    setMonthlyExpenses(expenses);
  };

  const calculateStoreExpenses = () => {
    const expenses = {};
    products.forEach(product => {
      if (product.active && product.store) {
        if (!expenses[product.store]) {
          expenses[product.store] = 0;
        }
        expenses[product.store] += product.price;
      }
    });

    const storeData = Object.entries(expenses).map(([store, amount]) => ({
      store,
      amount
    }));

    setStoreExpenses(storeData);
  };

  const calculateCategoryExpenses = () => {
    const expenses = {};
    products.forEach(product => {
      if (product.active && product.category) {
        if (!expenses[product.category]) {
          expenses[product.category] = 0;
        }
        expenses[product.category] += product.price;
      }
    });

    const categoryData = Object.entries(expenses).map(([category, amount]) => ({
      category,
      amount
    }));

    setCategoryExpenses(categoryData);
  };

  const comparePrices = () => {
    const currentMonthProducts = products.filter(p => {
      const date = getProductDate(p);
      return format(date, 'yyyy-MM') === selectedMonth && p.active;
    });
    
    const previousMonthProducts = products.filter(p => {
      const date = getProductDate(p);
      return format(date, 'yyyy-MM') === previousMonth && p.active;
    });

    const comparisons = currentMonthProducts.map(current => {
      const previous = previousMonthProducts.find(p => p.name === current.name);
      if (previous) {
        const priceDiff = current.price - previous.price;
        const priceDiffPercentage = ((priceDiff / previous.price) * 100).toFixed(1);
        return {
          name: current.name,
          currentPrice: current.price,
          previousPrice: previous.price,
          difference: priceDiff,
          percentage: priceDiffPercentage,
          store: current.store
        };
      }
      return null;
    }).filter(Boolean);

    setPriceComparisons(comparisons);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const chartData = Object.entries(monthlyExpenses)
    .map(([month, amount]) => ({
      month: format(new Date(month), 'MMM yyyy', { locale: es }),
      amount
    }))
    .reverse();

  return (
    <div className="price-analysis">
      <div className="analysis-header">
        <h2>Análisis de Precios y Gastos</h2>
        <div className="analysis-controls">
          <div className="form-group">
            <label>Rango de Tiempo:</label>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="form-control"
            >
              <option value="3">Últimos 3 meses</option>
              <option value="6">Últimos 6 meses</option>
              <option value="12">Últimos 12 meses</option>
            </select>
          </div>
          <div className="form-group">
            <label>Mes Actual:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Mes Anterior:</label>
            <input
              type="month"
              value={previousMonth}
              onChange={(e) => setPreviousMonth(e.target.value)}
              className="form-control"
            />
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Evolución de Gastos</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#2E7D32" 
                  name="Gastos"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Gastos por Tienda</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={storeExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="store" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar 
                  dataKey="amount" 
                  fill="#2E7D32" 
                  name="Gastos"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Gastos por Categoría</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar 
                  dataKey="amount" 
                  fill="#2E7D32" 
                  name="Gastos"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="expense-summary">
        <h3>Resumen de Gastos</h3>
        <div className="expense-cards">
          {Object.entries(monthlyExpenses).map(([month, amount]) => (
            <div key={month} className="expense-card">
              <h4>{format(new Date(month), 'MMMM yyyy', { locale: es })}</h4>
              <p className="expense-amount">{formatCurrency(amount)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="price-comparison">
        <h3>Comparación de Precios</h3>
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
              {priceComparisons.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.store}</td>
                  <td>{formatCurrency(item.currentPrice)}</td>
                  <td>{formatCurrency(item.previousPrice)}</td>
                  <td className={item.difference > 0 ? 'price-increase' : 'price-decrease'}>
                    {formatCurrency(item.difference)}
                  </td>
                  <td className={item.difference > 0 ? 'price-increase' : 'price-decrease'}>
                    {item.percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PriceAnalysis; 