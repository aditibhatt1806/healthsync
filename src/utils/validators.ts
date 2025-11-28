/**
 * Validation utilities for HealthSync backend
 * Provides input validation, sanitization, and data verification
 */

/**
 * Email validation
 * @param email - Email address to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
}

/**
 * Password strength validation
 * @param password - Password to validate
 * @returns Validation result with strength info
 */
export function validatePassword(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
} {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { isValid: false, strength, errors };
  }

  // Minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // Check for uppercase
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Check for lowercase
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Check for numbers
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Calculate strength
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 12;

  const strengthScore = [
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
    isLongEnough,
  ].filter(Boolean).length;

  if (strengthScore >= 4) strength = 'strong';
  else if (strengthScore >= 3) strength = 'medium';

  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
}

/**
 * Phone number validation (US format)
 * @param phone - Phone number to validate
 * @returns True if valid phone number
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // US phone numbers: 10 digits or 11 with country code
  return digitsOnly.length === 10 || (digitsOnly.length === 11 && digitsOnly[0] === '1');
}

/**
 * Age validation
 * @param age - Age to validate
 * @returns True if valid age (0-150)
 */
export function isValidAge(age: number): boolean {
  return typeof age === 'number' && age >= 0 && age <= 150 && Number.isInteger(age);
}

/**
 * Name validation
 * @param name - Name to validate
 * @returns True if valid name (2-50 characters, letters and spaces only)
 */
export function isValidName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;

  const trimmedName = name.trim();
  const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
  return nameRegex.test(trimmedName);
}

/**
 * Medication name validation
 * @param name - Medication name
 * @returns True if valid medication name
 */
export function isValidMedicationName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;

  const trimmedName = name.trim();
  return trimmedName.length >= 2 && trimmedName.length <= 100;
}

/**
 * Dosage validation
 * @param dosage - Medication dosage
 * @returns True if valid dosage format
 */
export function isValidDosage(dosage: string): boolean {
  if (!dosage || typeof dosage !== 'string') return false;

  const dosageRegex = /^\d+(\.\d+)?\s*(mg|g|ml|mcg|IU|units?)$/i;
  return dosageRegex.test(dosage.trim());
}

/**
 * Time validation (HH:MM format)
 * @param time - Time string
 * @returns True if valid time format
 */
export function isValidTime(time: string): boolean {
  if (!time || typeof time !== 'string') return false;

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

/**
 * Hex color validation
 * @param color - Color hex code
 * @returns True if valid hex color
 */
export function isValidHexColor(color: string): boolean {
  if (!color || typeof color !== 'string') return false;

  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

/**
 * Symptom severity validation (1-5)
 * @param severity - Severity number
 * @returns True if valid severity
 */
export function isValidSeverity(severity: number): boolean {
  return typeof severity === 'number' && severity >= 1 && severity <= 5 && Number.isInteger(severity);
}

/**
 * User role validation
 * @param role - User role
 * @returns True if valid role
 */
export function isValidRole(role: string): boolean {
  return role === 'patient' || role === 'doctor';
}

/**
 * Medication frequency validation
 * @param frequency - Medication frequency
 * @returns True if valid frequency
 */
export function isValidFrequency(frequency: string): boolean {
  const validFrequencies = ['daily', 'weekly', 'asNeeded'];
  return validFrequencies.includes(frequency);
}

/**
 * String sanitization - remove dangerous characters
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

/**
 * Sanitize user input object
 * @param obj - Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value) as any;
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
}

/**
 * Validate medication data
 * @param data - Medication data object
 * @returns Validation result
 */
export function validateMedicationData(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push('Invalid medication data');
    return { isValid: false, errors };
  }

  if (!isValidMedicationName(data.name)) {
    errors.push('Invalid medication name (2-100 characters required)');
  }

  if (!isValidDosage(data.dosage)) {
    errors.push('Invalid dosage format (e.g., 100mg, 5ml)');
  }

  if (!isValidTime(data.time)) {
    errors.push('Invalid time format (use HH:MM)');
  }

  if (data.color && !isValidHexColor(data.color)) {
    errors.push('Invalid color format (use hex color)');
  }

  if (data.frequency && !isValidFrequency(data.frequency)) {
    errors.push('Invalid frequency (must be: daily, weekly, or asNeeded)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate symptom data
 * @param data - Symptom data object
 * @returns Validation result
 */
export function validateSymptomData(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push('Invalid symptom data');
    return { isValid: false, errors };
  }

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Symptom name is required (minimum 2 characters)');
  }

  if (!isValidSeverity(data.severity)) {
    errors.push('Severity must be a number between 1 and 5');
  }

  if (data.notes && typeof data.notes === 'string' && data.notes.length > 1000) {
    errors.push('Notes must be less than 1000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate user profile data
 * @param data - User profile data
 * @returns Validation result
 */
export function validateUserProfile(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push('Invalid profile data');
    return { isValid: false, errors };
  }

  if (data.name && !isValidName(data.name)) {
    errors.push('Invalid name (2-50 characters, letters and spaces only)');
  }

  if (data.age !== undefined && !isValidAge(data.age)) {
    errors.push('Invalid age (must be between 0 and 150)');
  }

  if (data.phone && !isValidPhoneNumber(data.phone)) {
    errors.push('Invalid phone number format');
  }

  if (data.role && !isValidRole(data.role)) {
    errors.push('Invalid role (must be patient or doctor)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate file upload
 * @param file - File metadata
 * @returns Validation result
 */
export function validateFileUpload(file: {
  name: string;
  size: number;
  type: string;
}): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
  ];

  if (!file.name || file.name.length > 255) {
    errors.push('Invalid file name');
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.push('File size exceeds 10MB limit');
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    errors.push('File type not allowed (only JPEG, PNG, PDF)');
  }

  // Check for potentially dangerous file extensions
  const dangerousExtensions = ['.exe', '.bat', '.sh', '.cmd', '.js'];
  const fileExt = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (dangerousExtensions.includes(fileExt)) {
    errors.push('File type not allowed for security reasons');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate date range
 * @param startDate - Start date
 * @param endDate - End date
 * @returns True if valid range
 */
export function isValidDateRange(startDate: Date, endDate: Date): boolean {
  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    return false;
  }

  return startDate <= endDate;
}

/**
 * Validate pagination parameters
 * @param limit - Number of items per page
 * @param offset - Number of items to skip
 * @returns Validation result
 */
export function validatePagination(limit?: number, offset?: number): {
  isValid: boolean;
  errors: string[];
  sanitized: { limit: number; offset: number };
} {
  const errors: string[] = [];
  const MAX_LIMIT = 100;
  const DEFAULT_LIMIT = 10;

  let sanitizedLimit = DEFAULT_LIMIT;
  let sanitizedOffset = 0;

  if (limit !== undefined) {
    if (typeof limit !== 'number' || limit < 1) {
      errors.push('Limit must be a positive number');
    } else if (limit > MAX_LIMIT) {
      errors.push(`Limit cannot exceed ${MAX_LIMIT}`);
    } else {
      sanitizedLimit = Math.floor(limit);
    }
  }

  if (offset !== undefined) {
    if (typeof offset !== 'number' || offset < 0) {
      errors.push('Offset must be a non-negative number');
    } else {
      sanitizedOffset = Math.floor(offset);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: { limit: sanitizedLimit, offset: sanitizedOffset },
  };
}

/**
 * Check if string contains SQL injection patterns
 * @param input - Input string to check
 * @returns True if potentially dangerous
 */
export function containsSQLInjection(input: string): boolean {
  if (!input || typeof input !== 'string') return false;

  const sqlPatterns = [
    /(\bOR\b|\bAND\b).*?=/i,
    /UNION.*?SELECT/i,
    /DROP.*?TABLE/i,
    /INSERT.*?INTO/i,
    /DELETE.*?FROM/i,
    /--/,
    /;.*?DROP/i,
    /;.*?DELETE/i,
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Check if string contains XSS patterns
 * @param input - Input string to check
 * @returns True if potentially dangerous
 */
export function containsXSS(input: string): boolean {
  if (!input || typeof input !== 'string') return false;

  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /onload=/i,
    /onclick=/i,
    /<iframe/i,
    /eval\(/i,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Validate and sanitize search query
 * @param query - Search query string
 * @returns Sanitized query or null if invalid
 */
export function validateSearchQuery(query: string): string | null {
  if (!query || typeof query !== 'string') return null;

  const sanitized = query.trim();

  // Check minimum length
  if (sanitized.length < 2) return null;

  // Check maximum length
  if (sanitized.length > 100) return null;

  // Check for dangerous patterns
  if (containsSQLInjection(sanitized) || containsXSS(sanitized)) {
    return null;
  }

  return sanitized;
}

/**
 * Validate FCM token format
 * @param token - FCM token string
 * @returns True if valid format
 */
export function isValidFCMToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;

  // FCM tokens are typically 152+ characters
  return token.length >= 100 && token.length <= 200;
}

/**
 * Validate alert priority
 * @param priority - Priority level
 * @returns True if valid priority
 */
export function isValidPriority(priority: string): boolean {
  const validPriorities = ['low', 'normal', 'high'];
  return validPriorities.includes(priority);
}

/**
 * Batch validation helper
 * @param validations - Array of validation functions
 * @returns Combined validation result
 */
export function validateBatch(
  validations: Array<{ isValid: boolean; errors: string[] }>
): {
  isValid: boolean;
  errors: string[];
} {
  const allErrors: string[] = [];

  validations.forEach(validation => {
    if (!validation.isValid) {
      allErrors.push(...validation.errors);
    }
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}