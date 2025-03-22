// src/components/ProductItem.js
import React, { useState } from 'react';
import ProductEditForm from './ProductEditForm';

const ProductItem = ({ product, updateProduct, removeProduct }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (updatedProduct) => {
    updateProduct(updatedProduct);
    setIsEditing(false);
  };

  return (
    <li className="list-group-item">
      {isEditing ? (
        <ProductEditForm 
          product={product} 
          updateProduct={handleUpdate} 
          cancelEdit={() => setIsEditing(false)} 
        />
      ) : (
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <strong>{product.name}</strong> - {product.brand} - ${product.price} / {product.unit}
            {product.category && ` - ${product.category}`}
            {product.active === false && " (Desactivado)"}
          </div>
          <div>
            <button className="btn btn-primary btn-sm me-2" onClick={() => setIsEditing(true)}>Editar</button>
            <button className="btn btn-danger btn-sm" onClick={() => removeProduct(product.id)}>Desactivar</button>
          </div>
        </div>
      )}
    </li>
  );
};

export default ProductItem;
