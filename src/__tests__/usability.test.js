import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import PriceAnalysis from '../pages/PriceAnalysis';

describe('Usability Tests', () => {
  test('Dashboard navigation is accessible', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Verificar que los elementos principales son accesibles
    expect(screen.getByRole('heading', { name: /bienvenido/i })).toBeInTheDocument();
    expect(screen.getByText(/gestión de productos/i)).toBeInTheDocument();
    expect(screen.getByText(/análisis de precios/i)).toBeInTheDocument();
  });

  test('Product form is user-friendly', () => {
    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );

    // Verificar que los campos del formulario tienen labels descriptivos
    expect(screen.getByLabelText(/nombre del producto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/precio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument();

    // Verificar que hay retroalimentación visual
    const submitButton = screen.getByRole('button', { name: /agregar producto/i });
    fireEvent.click(submitButton);
    expect(screen.getByText(/este campo es requerido/i)).toBeInTheDocument();
  });

  test('Price analysis charts are responsive', () => {
    const { container } = render(
      <BrowserRouter>
        <PriceAnalysis />
      </BrowserRouter>
    );

    // Verificar que los gráficos son responsivos
    const charts = container.getElementsByClassName('recharts-responsive-container');
    expect(charts.length).toBeGreaterThan(0);
    
    // Verificar que hay controles de filtrado
    expect(screen.getByLabelText(/rango de tiempo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mes actual/i)).toBeInTheDocument();
  });

  test('Form validation provides clear feedback', () => {
    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText(/nombre del producto/i);
    const priceInput = screen.getByLabelText(/precio/i);

    // Probar validación de campos requeridos
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.blur(nameInput);
    expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument();

    // Probar validación de precio
    fireEvent.change(priceInput, { target: { value: '-1' } });
    fireEvent.blur(priceInput);
    expect(screen.getByText(/el precio debe ser mayor a 0/i)).toBeInTheDocument();
  });

  test('Loading states provide feedback', () => {
    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );

    // Verificar que hay indicadores de carga
    const loadingSpinner = screen.getByRole('status');
    expect(loadingSpinner).toBeInTheDocument();
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });
}); 