// src/components/SocialLogin.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebaseConfig';
import { 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup, 
  fetchSignInMethodsForEmail, 
  linkWithCredential 
} from 'firebase/auth';
import { FaGoogle, FaGithub } from 'react-icons/fa';

const SocialLogin = () => {
  const navigate = useNavigate();

  const handleSocialLogin = async (provider) => {
    try {
      // Intenta iniciar sesión con el proveedor seleccionado.
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      // Si el error es que la cuenta ya existe con otro proveedor
      if (error.code === 'auth/account-exists-with-different-credential') {
        // Obtiene la credencial pendiente y el email asociado
        const pendingCred = error.credential;
        const email = error.customData.email;
        // Obtiene los métodos de inicio de sesión para ese email
        const methods = await fetchSignInMethodsForEmail(auth, email);
        // Para este ejemplo, asumimos que el método existente es Google
        if (methods[0] === 'google.com') {
          alert(`El email ${email} ya está registrado con Google. Se te pedirá iniciar sesión con Google para vincular tus credenciales.`);
          // Crea una instancia del proveedor de Google
          const googleProvider = new GoogleAuthProvider();
          // Inicia sesión con Google
          const result = await signInWithPopup(auth, googleProvider);
          // Una vez autenticado, vincula la credencial pendiente (por ejemplo, de GitHub)
          await linkWithCredential(result.user, pendingCred);
          navigate('/dashboard');
        } else {
          alert(`El email ${email} ya está registrado. Inicia sesión con el proveedor existente para vincular la nueva credencial.`);
        }
      } else {
        console.error("Error en autenticación social:", error);
        alert("Error en autenticación social. Revisa la consola para más detalles.");
      }
    }
  };

  // Proveedores para Google y GitHub
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  return (
    <div className="mt-4">
      <button
        className="btn btn-danger me-2"
        onClick={() => handleSocialLogin(googleProvider)}
      >
        <FaGoogle size={20} className="me-1" /> Iniciar con Google
      </button>
      <button
        className="btn btn-dark"
        onClick={() => handleSocialLogin(githubProvider)}
      >
        <FaGithub size={20} className="me-1" /> Iniciar con GitHub
      </button>
    </div>
  );
};

export default SocialLogin;

