import { auth } from "./firebaseConfig";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  GoogleAuthProvider,
  GithubAuthProvider,
  EmailAuthProvider,
  reauthenticateWithPopup,
  updatePassword
} from "firebase/auth";

// Proveedores de autenticación
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Función auxiliar para manejar errores de autenticación
const handleAuthError = (error) => {
  console.error('Error de autenticación:', error);
  let message = "";
  switch (error.code) {
    case "auth/email-already-in-use":
      message = "Este correo electrónico ya está registrado.";
      break;
    case "auth/invalid-email":
      message = "El correo electrónico no es válido.";
      break;
    case "auth/operation-not-allowed":
      message = "Este método de inicio de sesión no está habilitado.";
      break;
    case "auth/weak-password":
      message = "La contraseña debe tener al menos 6 caracteres.";
      break;
    case "auth/user-disabled":
      message = "Esta cuenta ha sido deshabilitada.";
      break;
    case "auth/user-not-found":
      message = "No existe una cuenta con este correo electrónico. Si te registraste con Google o GitHub, usa ese método para iniciar sesión.";
      break;
    case "auth/wrong-password":
      message = "Contraseña incorrecta.";
      break;
    case "auth/invalid-credential":
      message = "Las credenciales son inválidas. Si te registraste con Google o GitHub, usa ese método para iniciar sesión.";
      break;
    default:
      message = error.message;
  }
  throw new Error(message);
};

// �� Iniciar sesión con Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    handleAuthError(error);
  }
};

// 🔹 Iniciar sesión con GitHub
export const loginWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result.user;
  } catch (error) {
    handleAuthError(error);
  }
};

// �� Iniciar sesión con email y contraseña
export const loginWithEmail = async (email, password) => {
  try {
    // Primero verificar si el email existe y con qué métodos
    const methods = await fetchSignInMethodsForEmail(auth, email);
    
    if (methods.length === 0) {
      throw new Error("No existe una cuenta con este correo electrónico. Por favor, regístrate primero.");
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        if (methods.includes('google.com')) {
          throw new Error("Este correo está registrado con Google. Por favor, usa el botón 'Continuar con Google'.");
        } else if (methods.includes('github.com')) {
          throw new Error("Este correo está registrado con GitHub. Por favor, usa el botón 'Continuar con GitHub'.");
        }
      }
      throw error;
    }
  } catch (error) {
    handleAuthError(error);
  }
};

// 🔹 Registrar usuario con email y contraseña
export const registerWithEmail = async (email, password) => {
  try {
    console.log('Intentando registrar:', email);
    // Primero verificar si el email ya existe
    const methods = await fetchSignInMethodsForEmail(auth, email);
    console.log('Métodos existentes:', methods);
    
    if (methods.length > 0) {
      console.log('Email ya registrado con métodos:', methods);
      // Si el usuario ya está autenticado y es el mismo email
      if (auth.currentUser && auth.currentUser.email === email) {
        console.log('Usuario autenticado, intentando vincular contraseña');
        // Intentar vincular email/contraseña a la cuenta existente
        return await linkEmailPassword(email, password);
      }
      
      // Si el email existe pero con otros métodos
      throw new Error(`Este email ya está registrado. Para agregar contraseña:\n1. Primero inicia sesión con ${methods.join(" o ")}\n2. Luego vuelve aquí para vincular una contraseña.`);
    }

    console.log('Creando nueva cuenta');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Cuenta creada exitosamente');
    return userCredential.user;
  } catch (error) {
    console.error('Error en registerWithEmail:', error);
    handleAuthError(error);
  }
};

// Función específica para cambiar contraseña
export const changePassword = async (newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No hay usuario autenticado");
    }

    // Primero reautenticar al usuario
    try {
      if (user.providerData.some(p => p.providerId === 'google.com')) {
        await reauthenticateWithPopup(user, googleProvider);
      } else if (user.providerData.some(p => p.providerId === 'github.com')) {
        await reauthenticateWithPopup(user, githubProvider);
      }
    } catch (reAuthError) {
      console.error('Error de reautenticación:', reAuthError);
      throw new Error("Por favor, vuelve a iniciar sesión antes de cambiar tu contraseña");
    }

    // Crear credencial y vincular/actualizar contraseña
    const credential = EmailAuthProvider.credential(user.email, newPassword);
    
    try {
      // Intentar vincular primero
      await linkWithCredential(user, credential);
      console.log('Contraseña vinculada exitosamente');
    } catch (linkError) {
      if (linkError.code === 'auth/provider-already-linked') {
        // Si ya está vinculado, actualizar la contraseña
        await updatePassword(user, newPassword);
        console.log('Contraseña actualizada exitosamente');
      } else {
        throw linkError;
      }
    }

    return user;
  } catch (error) {
    console.error('Error al gestionar contraseña:', error);
    if (error.code === 'auth/requires-recent-login') {
      throw new Error("Por seguridad, necesitas volver a iniciar sesión. Por favor, cierra sesión y vuelve a entrar con Google.");
    }
    handleAuthError(error);
  }
};

// Simplificar la función linkEmailPassword para evitar ciclos
export const linkEmailPassword = async (email, password) => {
  try {
    // Verificar que el usuario esté autenticado
    if (!auth.currentUser) {
      throw new Error("Debes iniciar sesión primero.");
    }

    // Verificar que el email coincida
    if (auth.currentUser.email !== email) {
      throw new Error("El email debe coincidir con tu cuenta actual.");
    }

    // Usar directamente changePassword que manejará tanto la vinculación como la actualización
    return await changePassword(password);
  } catch (error) {
    console.error('Error en linkEmailPassword:', error);
    handleAuthError(error);
  }
};
