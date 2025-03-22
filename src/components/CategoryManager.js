import React, { useState } from 'react';

const CategoryManager = ({ categories, addCategory, removeCategory }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!categoryName) return;
    addCategory({ id: Date.now(), name: categoryName });
    setCategoryName('');
  };

  return (
    <div className="mb-3">
      <h4>Gestión de Categorías</h4>
      <form onSubmit={handleAddCategory}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nueva categoría"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Agregar Categoría
        </button>
      </form>
      <ul className="list-group mt-3">
        {categories.map(category => (
          <li
            key={category.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {category.name}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => removeCategory(category.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;
