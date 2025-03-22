// src/pages/Contacto.js
import React, { useState } from 'react';

const Contacto = () => {
  const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' });
  const [envioExitoso, setEnvioExitoso] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar el mensaje a tu servicio de backend o Firebase Cloud Functions
    console.log("Mensaje enviado:", formData);
    setEnvioExitoso(true);
    setFormData({ nombre: '', email: '', mensaje: '' });
  };

  return (
    <div className="container my-4">
      <h2>Contacto / Soporte</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nombre</label>
          <input 
            type="text" 
            className="form-control" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input 
            type="email" 
            className="form-control" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="mb-3">
          <label>Mensaje</label>
          <textarea 
            className="form-control" 
            name="mensaje" 
            value={formData.mensaje} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary">Enviar Mensaje</button>
      </form>
      {envioExitoso && (
        <div className="alert alert-success mt-3">
          ¡Tu mensaje ha sido enviado! Nos pondremos en contacto contigo.
        </div>
      )}
    </div>
  );
};

export default Contacto;
