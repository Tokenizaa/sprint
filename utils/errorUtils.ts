// Utility for centralized error handling and notifications
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number; // in milliseconds
}

// Error handling utilities
export const handleError = (error: unknown, defaultMessage: string = "Ocorreu um erro inesperado"): string => {
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }
  
  if (typeof error === 'string') {
    return error || defaultMessage;
  }
  
  return defaultMessage;
};

export const createNotification = (
  type: NotificationType, 
  message: string, 
  duration: number = 3000
): Notification => {
  return {
    id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    message,
    duration
  };
};

// Common error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Erro de conexão. Verifique sua internet e tente novamente.",
  SERVER_ERROR: "Erro no servidor. Tente novamente mais tarde.",
  UNAUTHORIZED: "Acesso não autorizado. Faça login novamente.",
  FORBIDDEN: "Acesso negado. Você não tem permissão para realizar esta ação.",
  NOT_FOUND: "Recurso não encontrado.",
  VALIDATION_ERROR: "Dados inválidos. Verifique os campos e tente novamente.",
  TIMEOUT: "Tempo limite excedido. Tente novamente.",
  UNKNOWN_ERROR: "Ocorreu um erro inesperado. Tente novamente."
};

// Success messages
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: "Dados salvos com sucesso!",
  DELETE_SUCCESS: "Dados excluídos com sucesso!",
  UPDATE_SUCCESS: "Dados atualizados com sucesso!",
  LOGIN_SUCCESS: "Login realizado com sucesso!",
  LOGOUT_SUCCESS: "Logout realizado com sucesso!",
  REGISTRATION_SUCCESS: "Cadastro realizado com sucesso!"
};

// Validation helpers
export const validateRequired = (value: string | number | boolean, fieldName: string): string | null => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} é obrigatório`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Email inválido";
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
  if (value.length < minLength) {
    return `${fieldName} deve ter pelo menos ${minLength} caracteres`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | null => {
  if (value.length > maxLength) {
    return `${fieldName} não pode ter mais de ${maxLength} caracteres`;
  }
  return null;
};

// Async error boundary helper
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorMessage: string = "Ocorreu um erro ao executar a operação"
): ((...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | null>) => {
  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(error);
      // In a real app, you might want to show a notification to the user
      // or dispatch an error to a global state management system
      return null;
    }
  };
};