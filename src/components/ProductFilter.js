// src/components/ProductFilter.js
import React, { useState } from 'react';

const ProductFilter = ({ onFilter }) => {
  const [filter, setFilter] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    onFilter(value);
  };

  return (
    <div className="mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Filtrar por nombre, marca o categoría"
        value={filter}
        onChange={handleChange}
      />
    </div>
  );
};

export default ProductFilter;
