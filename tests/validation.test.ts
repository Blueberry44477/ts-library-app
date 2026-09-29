import { expect } from 'chai';
import { Validation } from '../src/utils/validators';

describe('Validation', () => {
  describe('validateBook', () => {
    it('should pass with valid data', () => {
      const errors = Validation.validateBook('Title', 'Author', '2023');
      expect(errors.length).to.equal(0);
    });

    it('should return error for empty title', () => {
      const errors = Validation.validateBook('', 'Author', '2023');
      expect(errors).to.include('Назва книги обов’язкова.');
    });

    it('should return error for invalid year', () => {
      const errors = Validation.validateBook('Title', 'Author', 'abcd');
      expect(errors).to.include('Рік видання має містити лише цифри.');
    });
  });

  describe('validateUser', () => {
    it('should pass with valid data', () => {
      const errors = Validation.validateUser('12345', 'Name', 'test@test.com');
      expect(errors.length).to.equal(0);
    });

    it('should return error for non-numeric id', () => {
      const errors = Validation.validateUser('abc', 'Name', 'test@test.com');
      expect(errors).to.include('ID має містити лише цифри.');
    });

    it('should return error for invalid email', () => {
      const errors = Validation.validateUser('123', 'Name', 'test');
      expect(errors).to.include('Введіть коректний Email.');
    });
  });
});
