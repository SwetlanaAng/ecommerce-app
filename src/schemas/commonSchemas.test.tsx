import {
  emailSchema,
  passwordSchema,
  firstNameSchema,
  lastNameSchema,
  dateOfBirthSchema,
  citySchema,
  streetSchema,
  postalCodeSchema,
} from './commonSchemas';

jest.mock('../shared/utils/functions', () => ({
  getAge: (date: Date) => {
    const today = new Date('2024-01-01');
    return today.getFullYear() - date.getFullYear();
  },
}));

describe('Validation Schemas', () => {
  describe('emailSchema', () => {
    it('accepts valid email', () => {
      expect(() => emailSchema.parse('user@example.com')).not.toThrow();
    });

    it('rejects invalid email', () => {
      expect(() => emailSchema.parse('userexample.com')).toThrow();
    });
  });

  describe('passwordSchema', () => {
    it('accepts strong password', () => {
      expect(() => passwordSchema.parse('Strong1!')).not.toThrow();
    });

    it('rejects short password', () => {
      expect(() => passwordSchema.parse('Short1!')).toThrow();
    });
  });

  describe('firstNameSchema', () => {
    it('accepts valid first name', () => {
      expect(() => firstNameSchema.parse('John')).not.toThrow();
    });

    it('rejects first name with digits', () => {
      expect(() => firstNameSchema.parse('John123')).toThrow();
    });
  });

  describe('lastNameSchema', () => {
    it('accepts valid last name', () => {
      expect(() => lastNameSchema.parse('Doe')).not.toThrow();
    });

    it('rejects last name with special characters', () => {
      expect(() => lastNameSchema.parse('D@e')).toThrow();
    });
  });

  describe('dateOfBirthSchema', () => {
    it('accepts date over 18 years ago', () => {
      expect(() => dateOfBirthSchema.parse('2000-01-01')).not.toThrow();
    });

    it('rejects date under 18 years ago', () => {
      expect(() => dateOfBirthSchema.parse('2010-01-01')).toThrow();
    });
  });

  describe('citySchema', () => {
    it('accepts valid city name', () => {
      expect(() => citySchema.parse('New York')).not.toThrow();
    });

    it('rejects city with digits', () => {
      expect(() => citySchema.parse('New York2')).toThrow();
    });
  });

  describe('streetSchema', () => {
    it('accepts valid street', () => {
      expect(() => streetSchema.parse('Main St. 42')).not.toThrow();
    });

    it('rejects street with disallowed characters', () => {
      expect(() => streetSchema.parse('Main@Street')).toThrow();
    });
  });

  describe('postalCodeSchema', () => {
    it('accepts 5-digit postal code', () => {
      expect(() => postalCodeSchema.parse('12345')).not.toThrow();
    });

    it('rejects postal code with letters', () => {
      expect(() => postalCodeSchema.parse('12a45')).toThrow();
    });
  });
});
