import { getAge } from './getAge';

describe('getAge', () => {
  const mockToday = (isoDate: string) => {
    jest.useFakeTimers().setSystemTime(new Date(isoDate));
  };

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns correct age when birthday has passed this year', () => {
    mockToday('2025-05-24');
    expect(getAge(new Date('2000-01-01'))).toBe(25);
  });

  it('returns correct age when birthday is today', () => {
    mockToday('2025-05-24');
    expect(getAge(new Date('2000-05-24'))).toBe(25);
  });

  it('returns correct age when birthday has not yet occurred this year', () => {
    mockToday('2025-05-24');
    expect(getAge(new Date('2000-12-01'))).toBe(24);
  });

  it('returns 0 for today’s birth date', () => {
    mockToday('2025-05-24');
    expect(getAge(new Date('2025-05-24'))).toBe(0);
  });

  it('handles leap year birthdate correctly (before Feb 29)', () => {
    mockToday('2025-03-01');
    expect(getAge(new Date('2004-02-29'))).toBe(21);
  });

  it('returns negative age if given a future date', () => {
    mockToday('2025-05-24');
    expect(getAge(new Date('2030-01-01'))).toBe(-5);
  });
});
