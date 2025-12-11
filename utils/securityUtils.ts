// Utility functions for input validation and sanitization
export const sanitizeInput = (input: string): string => {
  // Remove potentially dangerous characters
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Brazilian phone number validation (10 or 11 digits)
  const cleaned = phone.replace(/\D/g, '');
  return /^(\d{10}|\d{11})$/.test(cleaned);
};

export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'A senha deve ter pelo menos 6 caracteres' };
  }
  
  if (password.length > 50) {
    return { isValid: false, message: 'A senha não pode ter mais de 50 caracteres' };
  }
  
  return { isValid: true, message: '' };
};

export const validateName = (name: string): { isValid: boolean; message: string } => {
  const trimmed = name.trim();
  
  if (trimmed.length < 2) {
    return { isValid: false, message: 'O nome deve ter pelo menos 2 caracteres' };
  }
  
  if (trimmed.length > 100) {
    return { isValid: false, message: 'O nome não pode ter mais de 100 caracteres' };
  }
  
  // Check for potentially harmful characters
  if (/[<>{}[\]\\|]/.test(trimmed)) {
    return { isValid: false, message: 'O nome contém caracteres inválidos' };
  }
  
  return { isValid: true, message: '' };
};

export const validateQuantity = (quantity: string): { isValid: boolean; message: string } => {
  const num = parseInt(quantity, 10);
  
  if (isNaN(num) || num <= 0) {
    return { isValid: false, message: 'A quantidade deve ser um número positivo' };
  }
  
  if (num > 1000) {
    return { isValid: false, message: 'A quantidade não pode ser maior que 1000' };
  }
  
  return { isValid: true, message: '' };
};

// Simple password hashing simulation (in a real app, use bcrypt or similar)
export const hashPassword = (password: string): string => {
  // This is a placeholder - in a real application, use a proper hashing library
  return btoa(password); // Base64 encoding is NOT secure, just for demo
};

export const verifyPassword = (password: string, hash: string): boolean => {
  // This is a placeholder - in a real application, use a proper hashing library
  try {
    return atob(hash) === password;
  } catch {
    return false;
  }
};

// Environment variable validation
export const validateEnvironment = (): { isValid: boolean; missingVars: string[] } => {
  const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_KEY'];
  // Safe access to vite env to prevent crashes
  const viteEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};
  const missingVars = requiredVars.filter(varName => !viteEnv[varName]);
  
  return {
    isValid: missingVars.length === 0,
    missingVars
  };
};
