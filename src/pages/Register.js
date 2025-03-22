// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerWithEmail, loginWithGoogle, loginWithGithub } from '../services/authServices';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { auth } from '../services/firebaseConfig';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }

    if (password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres');
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await registerWithEmail(email, password);
      
      // Si el usuario ya estaba autenticado y vinculó correctamente la contraseña
      if (auth.currentUser) {
        setSuccess('¡Contraseña vinculada correctamente a tu cuenta!');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubRegister = async () => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await loginWithGithub();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-center mb-4">Crear Cuenta</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? 'Procesando...' : (auth.currentUser ? 'Vincular Contraseña' : 'Crear Cuenta')}
          </button>
        </form>

        <div className="divider">
          <span>O registrarse con</span>
        </div>

        <button
          onClick={handleGoogleRegister}
          className="btn btn-light border w-100 mb-2 d-flex align-items-center justify-content-center"
          disabled={loading}
        >
          <FcGoogle className="me-2" size={20} /> Google
        </button>

        <button
          onClick={handleGithubRegister}
          className="btn btn-dark w-100 mb-3 d-flex align-items-center justify-content-center"
          disabled={loading}
        >
          <FaGithub className="me-2" size={20} /> GitHub
        </button>

        <div className="text-center mt-3">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

// este codigo es para el registro de usuarios en una aplicación de lista de mercado. El usuario debe ingresar su email y contraseña para registrarse. Si el registro es exitoso, el usuario será redirigido a la página de dashboard. Si hay algún error, se mostrará un mensaje de error.
// El código utiliza el hook `useState` para manejar el estado de los campos de email y contraseña, así como el estado de error. También utiliza el hook `useNavigate` de React Router para redirigir al usuario después del registro. La función `handleRegister` se encarga de manejar el registro del usuario, utilizando la función `createUserWithEmailAndPassword` de Firebase Auth para crear un nuevo usuario con el email y contraseña proporcionados. Si hay algún error, se captura y se muestra en la interfaz de usuario.
// El formulario de registro incluye campos para el email y la contraseña, así como un botón para enviar el formulario. Si hay un error, se muestra un mensaje de error en la interfaz de usuario.