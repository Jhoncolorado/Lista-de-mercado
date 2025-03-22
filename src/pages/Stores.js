import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from '../services/firebaseConfig';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [newStore, setNewStore] = useState({ name: '', address: '', description: '' });
  const [editingStore, setEditingStore] = useState(null);
  const [isAddingStore, setIsAddingStore] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    const q = query(collection(db, "stores"));
    const querySnapshot = await getDocs(q);
    const storesData = [];
    querySnapshot.forEach(doc => {
      storesData.push({ id: doc.id, ...doc.data() });
    });
    setStores(storesData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingStore) {
      // Actualizar tienda existente
      const storeRef = doc(db, "stores", editingStore.id);
      await updateDoc(storeRef, newStore);
      setEditingStore(null);
    } else {
      // Agregar nueva tienda
      await addDoc(collection(db, "stores"), {
        ...newStore,
        createdAt: new Date()
      });
    }
    setNewStore({ name: '', address: '', description: '' });
    setIsAddingStore(false);
    fetchStores();
  };

  const startEdit = (store) => {
    setEditingStore(store);
    setNewStore({
      name: store.name,
      address: store.address || '',
      description: store.description || ''
    });
    setIsAddingStore(true);
  };

  const deleteStore = async (storeId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tienda?')) {
      await deleteDoc(doc(db, "stores", storeId));
      fetchStores();
    }
  };

  return (
    <div className="stores-page fade-in">
      <div className="page-header">
        <h2>Gestión de Tiendas</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setIsAddingStore(!isAddingStore);
            setEditingStore(null);
            setNewStore({ name: '', address: '', description: '' });
          }}
        >
          {isAddingStore ? 'Cancelar' : 'Agregar Tienda'}
        </button>
      </div>

      <div className="content-section">
        {isAddingStore && (
          <div className="store-form-section">
            <h3>{editingStore ? 'Editar Tienda' : 'Nueva Tienda'}</h3>
            <form onSubmit={handleSubmit} className="store-form">
              <div className="form-group">
                <label>Nombre de la Tienda</label>
                <input
                  type="text"
                  className="form-control"
                  value={newStore.name}
                  onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Dirección</label>
                <input
                  type="text"
                  className="form-control"
                  value={newStore.address}
                  onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  className="form-control"
                  value={newStore.description}
                  onChange={(e) => setNewStore({ ...newStore, description: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-success">
                {editingStore ? 'Actualizar' : 'Guardar'}
              </button>
            </form>
          </div>
        )}

        <div className="stores-grid">
          {stores.map(store => (
            <div key={store.id} className="store-card card">
              <div className="store-card-header">
                <h3>{store.name}</h3>
                <div className="store-actions">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => startEdit(store)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteStore(store.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              {store.address && (
                <p className="store-address">
                  <i className="fas fa-map-marker-alt"></i> {store.address}
                </p>
              )}
              {store.description && (
                <p className="store-description">{store.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stores; 