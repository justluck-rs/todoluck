import React, { createContext, useState, useContext, useCallback } from 'react';
import { Toast } from '../components/toast/Toast';

// Criar o contexto
const ToastContext = createContext();

// Hook personalizado para usar o contexto
export const useToast = () => {
  return useContext(ToastContext);
};

// Provedor do contexto
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Adicionar um novo toast
  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);
    return id;
  }, []);

  // Remover um toast específico
  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // Métodos de conveniência para diferentes tipos de toast
  const showSuccess = useCallback((message, duration) => {
    return addToast(message, 'success', duration);
  }, [addToast]);

  const showError = useCallback((message, duration) => {
    return addToast(message, 'error', duration);
  }, [addToast]);

  const showInfo = useCallback((message, duration) => {
    return addToast(message, 'info', duration);
  }, [addToast]);

  const showWarning = useCallback((message, duration) => {
    return addToast(message, 'warning', duration);
  }, [addToast]);

  // Valor do contexto
  const value = {
    addToast,
    removeToast,
    showSuccess,
    showError,
    showInfo,
    showWarning
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
