import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle, loginWithGithub } from '../services/authServices';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginEmail = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor ingresa tu correo y contraseña');
      return;
    }

    try {
      setError('');
      setLoading(true);
      console.log('Intentando iniciar sesión con:', email);
      await loginWithEmail(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error en login:', err);
      setError(err.message);
      // Si el error indica que no existe la cuenta, agregar sugerencia
      if (err.message.includes('No existe una cuenta')) {
        setError(err.message + '\n\nSi ya te registraste con Google o GitHub, usa ese método para iniciar sesión primero.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      console.log('Iniciando sesión con Google');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error('Error en login con Google:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setError('');
      setLoading(true);
      console.log('Iniciando sesión con GitHub');
      await loginWithGithub();
      navigate('/dashboard');
    } catch (err) {
      console.error('Error en login con GitHub:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        
        {error && (
          <div className="alert alert-danger" style={{ whiteSpace: 'pre-line' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLoginEmail}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="tu@email.com"
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
              placeholder="Tu contraseña"
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="divider">
          <span>O continuar con</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="btn btn-light border w-100 mb-2 d-flex align-items-center justify-content-center"
          disabled={loading}
        >
          <FcGoogle className="me-2" size={20} /> Google
        </button>

        <button
          onClick={handleGithubLogin}
          className="btn btn-dark w-100 mb-3 d-flex align-items-center justify-content-center"
          disabled={loading}
        >
          <FaGithub className="me-2" size={20} /> GitHub
        </button>

        <div className="text-center mt-3">
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;





