// src/components/BulkCalculator.js
import React, { useState } from 'react';

const BulkCalculator = () => {
  const [totalPrice, setTotalPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState(null);

  const calculateUnitPrice = (e) => {
    e.preventDefault();
    if (quantity > 0) {
      setUnitPrice(totalPrice / quantity);
    }
  };

  return (
    <div className="mt-4">
      <h3>Calculadora de Compras a Granel</h3>
      <form onSubmit={calculateUnitPrice}>
        <div className="mb-3">
          <label>Precio Total</label>
          <input 
            type="number" 
            className="form-control" 
            value={totalPrice} 
            onChange={(e) => setTotalPrice(parseFloat(e.target.value))} 
            required 
          />
        </div>
        <div className="mb-3">
          <label>Cantidad</label>
          <input 
            type="number" 
            className="form-control" 
            value={quantity} 
            onChange={(e) => setQuantity(parseFloat(e.target.value))} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary">Calcular Precio Unitario</button>
      </form>
      {unitPrice !== null && (
        <div className="mt-3">
          <strong>Precio Unitario:</strong> {unitPrice.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default BulkCalculator;

