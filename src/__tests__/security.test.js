import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { AuthProvider } from '../contexts/AuthContext';
import Login from '../pages/Login';
import Register from '../pages/Register';

describe('Security Tests', () => {
  test('Password validation on registration', () => {
    render(
      <AuthProvider>
        <Register />
      </AuthProvider>
    );

    const passwordInput = screen.getByLabelText(/contraseña/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });

    // Test weak password
    act(() => {
      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: '123' } });
      fireEvent.click(submitButton);
    });

    expect(screen.getByText(/la contraseña debe tener al menos 6 caracteres/i)).toBeInTheDocument();

    // Test password mismatch
    act(() => {
      fireEvent.change(passwordInput, { target: { value: '123456' } });
      fireEvent.change(confirmPasswordInput, { target: { value: '1234567' } });
      fireEvent.click(submitButton);
    });

    expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
  });

  test('Login form security', () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    // Test empty fields
    act(() => {
      fireEvent.click(submitButton);
    });

    expect(screen.getByText(/por favor ingresa tu correo y contraseña/i)).toBeInTheDocument();

    // Test invalid email
    act(() => {
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.change(passwordInput, { target: { value: '123456' } });
      fireEvent.click(submitButton);
    });

    expect(screen.getByText(/el correo electrónico no es válido/i)).toBeInTheDocument();
  });
}); 