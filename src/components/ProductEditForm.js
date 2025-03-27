// src/components/ProductEditForm.js
import React, { useState, useEffect } from 'react';

const ProductEditForm = ({ product, updateProduct, cancelEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    unit: '',
    category: '',
    store: '',
    active: true
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        price: product.price || '',
        unit: product.unit || '',
        category: product.category || '',
        store: product.store || '',
        active: product.active !== false
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProduct({
      ...product,
      ...formData,
      price: parseFloat(formData.price)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="product-edit-form">
      <div className="form-group">
        <label htmlFor="name">Nombre del Producto</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="brand">Marca</label>
        <input
          type="text"
          id="brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Precio</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="unit">Unidad</label>
        <input
          type="text"
          id="unit"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Categoría</label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="store">Tienda</label>
        <input
          type="text"
          id="store"
          name="store"
          value={formData.store}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />
          Producto Activo
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Guardar Cambios
        </button>
        <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ProductEditForm;

