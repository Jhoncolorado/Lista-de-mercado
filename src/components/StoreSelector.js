import React from 'react';

const StoreSelector = ({ stores, selectedStore, onStoreChange }) => {
  return (
    <div className="mb-3">
      <label>Selecciona una tienda:</label>
      <select 
        className="form-control"
        value={selectedStore}
        onChange={(e) => onStoreChange(e.target.value)}
      >
        <option value="">-- Selecciona --</option>
        {stores.map(store => (
          <option key={store.id} value={store.name}>
            {store.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StoreSelector;
