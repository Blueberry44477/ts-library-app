export namespace Validation {
  export const isRequired = (value: string): boolean => {
    return value.trim().length > 0;
  };

  export const isNumberOnly = (value: string): boolean => {
    return /^\d+$/.test(value);
  };

  export const isYear = (value: string): boolean => {
    return /^(19|20)\d{2}$/.test(value) || /^\d{1,4}$/.test(value); 
  };

  export const isValidEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  export const validateBook = (title: string, author: string, year: string): string[] => {
    const errors: string[] = [];
    if (!isRequired(title)) errors.push('Назва книги обов’язкова.');
    if (!isRequired(author)) errors.push('Автор обов’язковий.');
    if (!isRequired(year)) {
      errors.push('Рік видання обов’язковий.');
    } else if (!isNumberOnly(year)) {
      errors.push('Рік видання має містити лише цифри.');
    }
    return errors;
  };

  export const validateUser = (id: string, name: string, email: string): string[] => {
    const errors: string[] = [];
    if (!isRequired(id)) {
      errors.push('ID обов’язковий.');
    } else if (!isNumberOnly(id)) {
      errors.push('ID має містити лише цифри.');
    }
    if (!isRequired(name)) errors.push('Ім’я обов’язкове.');
    if (!isRequired(email)) {
      errors.push('Email обов’язковий.');
    } else if (!isValidEmail(email)) {
      errors.push('Введіть коректний Email.');
    }
    return errors;
  };
}
