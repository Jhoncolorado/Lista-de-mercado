import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from '../services/firebaseConfig';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: '#00a2ff' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const q = query(collection(db, "categories"));
    const querySnapshot = await getDocs(q);
    const categoriesData = [];
    querySnapshot.forEach(doc => {
      categoriesData.push({ id: doc.id, ...doc.data() });
    });
    setCategories(categoriesData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCategory) {
      // Actualizar categoría existente
      const categoryRef = doc(db, "categories", editingCategory.id);
      await updateDoc(categoryRef, newCategory);
      setEditingCategory(null);
    } else {
      // Agregar nueva categoría
      await addDoc(collection(db, "categories"), {
        ...newCategory,
        createdAt: new Date()
      });
    }
    setNewCategory({ name: '', description: '', color: '#00a2ff' });
    setIsAddingCategory(false);
    fetchCategories();
  };

  const startEdit = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description || '',
      color: category.color || '#00a2ff'
    });
    setIsAddingCategory(true);
  };

  const deleteCategory = async (categoryId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      await deleteDoc(doc(db, "categories", categoryId));
      fetchCategories();
    }
  };

  return (
    <div className="categories-page fade-in">
      <div className="page-header">
        <h2>Gestión de Categorías</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setIsAddingCategory(!isAddingCategory);
            setEditingCategory(null);
            setNewCategory({ name: '', description: '', color: '#00a2ff' });
          }}
        >
          {isAddingCategory ? 'Cancelar' : 'Agregar Categoría'}
        </button>
      </div>

      <div className="content-section">
        {isAddingCategory && (
          <div className="category-form-section">
            <h3>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label>Nombre de la Categoría</label>
                <input
                  type="text"
                  className="form-control"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  className="form-control"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Color</label>
                <div className="color-picker">
                  <input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="form-control-color"
                  />
                  <span className="color-preview" style={{ backgroundColor: newCategory.color }}></span>
                </div>
              </div>
              <button type="submit" className="btn btn-success">
                {editingCategory ? 'Actualizar' : 'Guardar'}
              </button>
            </form>
          </div>
        )}

        <div className="categories-grid">
          {categories.map(category => (
            <div 
              key={category.id} 
              className="category-card card"
              style={{ borderLeft: `4px solid ${category.color || '#00a2ff'}` }}
            >
              <div className="category-card-header">
                <h3>{category.name}</h3>
                <div className="category-actions">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => startEdit(category)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteCategory(category.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              {category.description && (
                <p className="category-description">{category.description}</p>
              )}
              <div className="category-stats">
                <span className="category-color" style={{ backgroundColor: category.color }}></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories; 