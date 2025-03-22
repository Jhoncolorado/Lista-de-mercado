// src/components/ProductEditForm.js
import React, { useState } from 'react';

const ProductEditForm = ({ product, updateProduct, cancelEdit }) => {
  const [name, setName] = useState(product.name);
  const [brand, setBrand] = useState(product.brand);
  const [price, setPrice] = useState(product.price);
  const [unit, setUnit] = useState(product.unit);
  const [category, setCategory] = useState(product.category || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProduct = { ...product, name, brand, price, unit, category };
    updateProduct(updatedProduct);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label>Nombre del Producto</label>
        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Marca</label>
        <input type="text" className="form-control" value={brand} onChange={(e) => setBrand(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Precio</label>
        <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Unidad de Medida</label>
        <input type="text" className="form-control" value={unit} onChange={(e) => setUnit(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Categoría</label>
        <input type="text" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <button type="submit" className="btn btn-success btn-sm">Actualizar</button>
      <button type="button" className="btn btn-secondary btn-sm ms-2" onClick={cancelEdit}>Cancelar</button>
    </form>
  );
};

export default ProductEditForm;

