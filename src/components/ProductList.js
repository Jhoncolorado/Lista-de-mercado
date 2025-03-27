// src/components/ProductList.js
import React, { useState } from 'react';
import ProductEditForm from './ProductEditForm';

const ProductList = ({ products, updateProduct, removeProduct }) => {
  const [editingProduct, setEditingProduct] = useState(null);

  const handleUpdate = (updatedProduct) => {
    updateProduct(updatedProduct);
    setEditingProduct(null);
  };

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
            {editingProduct?.id === product.id ? (
              <ProductEditForm
                product={product}
                updateProduct={handleUpdate}
                cancelEdit={() => setEditingProduct(null)}
              />
            ) : (
              <>
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
                    onClick={() => setEditingProduct(product)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-danger btn-sm ms-2" 
                    onClick={() => removeProduct(product.id)}
                  >
                    {product.active ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

