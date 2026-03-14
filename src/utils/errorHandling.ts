// Centralized error handling utilities

import { toast } from "@/hooks/use-toast";
import type { ApiError } from "@/types";

export class AppError extends Error {
  public readonly code: string;
  public readonly context?: Record<string, unknown>;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', context?: Record<string, unknown>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
  }
}

export const createApiError = (error: unknown, defaultMessage: string = 'An unexpected error occurred'): ApiError => {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      details: error.context
    };
  }

  const err = error as Record<string, unknown> | null | undefined;

  if (err?.message) {
    return {
      message: String(err.message),
      code: (err.code as string) || 'API_ERROR',
      details: error
    };
  }

  return {
    message: defaultMessage,
    code: 'UNKNOWN_ERROR',
    details: error
  };
};

export const handleError = (
  error: unknown,
  context: string,
  options: {
    showToast?: boolean;
    logError?: boolean;
    fallbackMessage?: string;
    userId?: string;
  } = {}
): ApiError => {
  const {
    showToast = true,
    logError = true,
    fallbackMessage = 'An unexpected error occurred',
    userId
  } = options;

  const apiError = createApiError(error, fallbackMessage);

  if (logError) {
    logger.error(`Error in ${context}`, error, {
      userId,
      errorCode: apiError.code,
      context
    });
  }

  if (showToast) {
    toast({
      title: "Error",
      description: apiError.message,
      variant: "destructive"
    });
  }

  return apiError;
};

export const handleAsyncError = async <T>(
  asyncOperation: () => Promise<T>,
  context: string,
  options: {
    showToast?: boolean;
    logError?: boolean;
    fallbackMessage?: string;
    userId?: string;
    fallbackValue?: T;
  } = {}
): Promise<{ data: T | null; error: ApiError | null }> => {
  try {
    const data = await asyncOperation();
    return { data, error: null };
  } catch (error) {
    const apiError = handleError(error, context, options);
    return { 
      data: options.fallbackValue || null, 
      error: apiError 
    };
  }
};

export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff
      const delay = delayMs * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

export const validateRequired = <T>(
  value: T | null | undefined,
  fieldName: string
): T => {
  if (value === null || value === undefined) {
    throw new AppError(`${fieldName} is required`, 'VALIDATION_ERROR');
  }
  return value;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
  return phoneRegex.test(phone);
};

export const safeAsyncOperation = async <T>(
  operation: () => Promise<T>,
  fallback: T,
  context: string = 'operation'
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    logger.warn(`Safe async operation failed in ${context}`, error);
    return fallback;
  }
};

// Error boundary helper
export const getErrorInfo = (error: Error, errorInfo?: { componentStack?: string }) => ({
  message: error.message,
  stack: error.stack,
  componentStack: errorInfo?.componentStack,
  timestamp: new Date().toISOString()
});

// Network error handling
export const isNetworkError = (error: unknown): boolean => {
  const err = error as Record<string, unknown> | null | undefined;
  const message = typeof err?.message === 'string' ? err.message : '';
  return err?.code === 'NETWORK_ERROR' ||
         message.includes('fetch') ||
         message.includes('network');
};

export const isAuthError = (error: unknown): boolean => {
  const err = error as Record<string, unknown> | null | undefined;
  const message = typeof err?.message === 'string' ? err.message : '';
  return err?.code === 'PGRST301' || // JWT expired
         err?.code === 'PGRST302' || // JWT invalid
         message.includes('JWT') ||
         message.includes('auth');
};

export const getRetryDelay = (attempt: number, baseDelay: number = 1000): number => {
  return Math.min(baseDelay * Math.pow(2, attempt), 30000); // Max 30 seconds
};

export const shouldRetry = (error: unknown, attempt: number, maxRetries: number): boolean => {
  if (attempt >= maxRetries) return false;

  const err = error as Record<string, unknown> | null | undefined;
  const status = typeof err?.status === 'number' ? err.status : 0;

  // Don't retry auth errors or client errors
  if (isAuthError(error) || (status >= 400 && status < 500)) {
    return false;
  }

  // Retry network errors and server errors
  return isNetworkError(error) || status >= 500;
};