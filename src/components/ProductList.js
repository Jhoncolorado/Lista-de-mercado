// src/components/ProductList.js
import React from 'react';
import ProductItem from './ProductItem';

const ProductList = ({ products, updateProduct, removeProduct }) => {
  if (!products || products.length === 0) {
    return (
      <div className="alert alert-info">
        No hay productos para mostrar.
      </div>
    );
  }

  return (
    <div className="products-section">
      <h3>Lista de Productos</h3>
      <div className="products-list">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h4>{product.name}</h4>
            <p className="brand">{product.brand}</p>
            <p className="price">${product.price} / {product.unit}</p>
            {product.category && (
              <p className="category">{product.category}</p>
            )}
            {product.store && (
              <span className="store-badge">{product.store}</span>
            )}
            <div className="product-actions">
              <button 
                className="btn btn-primary btn-sm" 
                onClick={() => updateProduct(product)}
              >
                Editar
              </button>
              <button 
                className="btn btn-danger btn-sm ms-2" 
                onClick={() => removeProduct(product.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

