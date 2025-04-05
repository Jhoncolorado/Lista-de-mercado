// src/pages/Contacto.js
import React, { useState, useRef, useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import emailjs from '@emailjs/browser';

const Contacto = () => {
  const form = useRef();
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Inicializar EmailJS
    emailjs.init('otMBvxVALs1C_-wVc');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const result = await emailjs.sendForm(
        'service_67gzh7c',
        'template_iat4brq',
        form.current,
        'otMBvxVALs1C_-wVc'
      );

      if (result.text === 'OK') {
        setStatus({
          type: 'success',
          message: '¡Tu mensaje ha sido enviado! Nos pondremos en contacto contigo pronto.'
        });
        form.current.reset();
      } else {
        throw new Error('Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      setStatus({
        type: 'danger',
        message: 'Lo sentimos, hubo un error al enviar tu mensaje. Por favor, intenta nuevamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4">Contacto y Soporte</h2>
              
              <div className="alert alert-info mb-4">
                <h5 className="alert-heading">¿Necesitas ayuda?</h5>
                <p className="mb-0">
                  Estamos aquí para ayudarte. Completa el formulario a continuación y te responderemos
                  lo antes posible. También puedes encontrar respuestas a preguntas frecuentes en nuestra
                  sección de ayuda.
                </p>
              </div>

              {status.type && (
                <Alert variant={status.type} className="mb-4">
                  {status.message}
                </Alert>
              )}

              <form ref={form} onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="from_name" 
                    required 
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    name="from_email" 
                    required 
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mensaje</label>
                  <textarea 
                    className="form-control" 
                    name="message" 
                    required 
                    disabled={loading}
                    rows="5"
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-100" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Mensaje'
                  )}
                </button>
              </form>

              <div className="mt-4">
                <h5>Otros medios de contacto</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-envelope me-2"></i>
                    stivenhenaoronaldo1187@gmail.com
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-telephone me-2"></i>
                    +1 234 567 890
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-clock me-2"></i>
                    Lunes a Viernes, 9:00 AM - 6:00 PM
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
