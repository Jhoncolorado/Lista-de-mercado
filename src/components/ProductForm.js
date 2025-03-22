// src/components/ProductForm.js
import React, { useState } from 'react';

const ProductForm = ({ addProduct }) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = { name, brand, price, unit, category };
    addProduct(newProduct);
    // Limpiar campos
    setName('');
    setBrand('');
    setPrice('');
    setUnit('');
    setCategory('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label>Nombre del Producto</label>
        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label>Marca</label>
        <input type="text" className="form-control" value={brand} onChange={(e) => setBrand(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label>Precio</label>
        <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label>Unidad de Medida</label>
        <input type="text" className="form-control" value={unit} onChange={(e) => setUnit(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label>Categoría (opcional)</label>
        <input type="text" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <button type="submit" className="btn btn-success">Agregar Producto</button>
    </form>
  );
};

export default ProductForm;
