// src/components/LinkEmailPassword.js
import React, { useState } from 'react';
import { auth } from '../services/firebaseConfig';
import { EmailAuthProvider, linkWithCredential } from "firebase/auth";

const LinkEmailPassword = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLink = async (e) => {
    e.preventDefault();
    try {
      // Obtiene el usuario actual
      const user = auth.currentUser;
      if (!user) {
        setMessage("No hay un usuario autenticado.");
        return;
      }
      // Crea una credencial con el email del usuario y la nueva contraseña
      const credential = EmailAuthProvider.credential(user.email, password);
      // Vincula la credencial a la cuenta existente
      await linkWithCredential(user, credential);
      setMessage("Método de correo y contraseña vinculado exitosamente.");
    } catch (error) {
      console.error("Error al vincular la cuenta:", error);
      setMessage("Error al vincular la cuenta: " + error.message);
    }
  };

  return (
    <div>
      <h2>Vincular Método de Correo y Contraseña</h2>
      <p>
        Si deseas poder iniciar sesión con tu correo además de Google, ingresa una nueva contraseña.
      </p>
      <form onSubmit={handleLink}>
        <div className="mb-3">
          <label>Nueva Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Vincular Cuenta</button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default LinkEmailPassword;
