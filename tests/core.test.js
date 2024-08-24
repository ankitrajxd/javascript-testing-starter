import { describe, it, expect, beforeEach } from 'vitest';
import {
  Stack,
  calculateDiscount,
  canDrive,
  fetchData,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  validateUserInput,
} from '../src/core';

describe('test suite', () => {
  it('test case', () => {
    // const result = [3,2,1]
    const result = {
      name: 'ankit',
    };

    expect(result).toBeDefined();
    // expect(result).toEqual(expect.arrayContaining([1,2,3]))
    // expect(result.length).toBeGreaterThan(0);
    expect(result).toHaveProperty('name');
    expect(typeof result.name).toBe('string');
  });
});

describe('getCoupons', () => {
  const result = getCoupons();

  it('should return an array of coupons', () => {
    expect(result.length).greaterThan(0);
    expect(result).toBeInstanceOf(Array);
  });

  it('should return an array with valid coupon codes', () => {
    result.forEach((coupon) => {
      expect(coupon).toHaveProperty('code');
      expect(typeof coupon.code).toBe('string');
      expect(coupon.code).toBeTruthy();
    });
  });

  it('should return an array with valid discounts', () => {
    result.forEach((coupon) => {
      expect(coupon).toHaveProperty('discount');
      expect(typeof coupon.discount).toBe('number');
      expect(coupon.discount).toBeGreaterThanOrEqual(0);
      expect(coupon.discount).toBeLessThanOrEqual(1);
    });
  });
});

describe('calculateDiscount', () => {
  it('should return discounted price if given valid code', () => {
    expect(calculateDiscount(10, 'SAVE10')).toBe(9);
  });
  it('should return discounted price if given valid code', () => {
    expect(calculateDiscount(10, 'SAVE20')).toBe(8);
  });

  it('should handle non-numeric price', () => {
    expect(calculateDiscount('10', 'SAVE10')).toMatch(/invalid/i);
  });
  it('should handle negative price', () => {
    expect(calculateDiscount(-10, 'SAVE10')).toMatch(/invalid/i);
  });
  it('should handle non-string discount code', () => {
    expect(calculateDiscount(10, 10)).toMatch(/invalid/i);
  });
  it('should handle invalid discount code', () => {
    expect(calculateDiscount(10, 'INVALID')).toBe(10);
  });
});

// test suite for validate user Input // positive negative test

describe('validateUserInput', () => {
  // positive test

  it('should handle valid user input', () => {
    expect(validateUserInput('gojosatoru', 28)).toMatch(/success/i);
  });

  // negative test
  it('should return an error if age is not a number', () => {
    const result = validateUserInput('gojosatoru', '18');
    expect(result).toMatch(/invalid/i);
  });
  it('should return an error if both age and username is not valid', () => {
    const result = validateUserInput(278232, '18');
    expect(result).toMatch(/invalid/i);
  });
  it('should return an error if age is less than 18', () => {
    const result = validateUserInput('gojosatoru', 16);
    expect(result).toMatch(/invalid/i);
  });
  it('should return an error if age is greater than 100', () => {
    const result = validateUserInput('gojosatoru', 161);
    expect(result).toMatch(/invalid/i);
  });
  it('should return an error if username is not a string', () => {
    const result = validateUserInput(12345, 18);
    expect(result).toMatch(/invalid/i);
  });
  it('should return an error if username is less than 3 characters', () => {
    const result = validateUserInput('ab', 18);
    expect(result).toMatch(/invalid/i);
  });
  it('should return an error if username is longer than 255 characters', () => {
    const result = validateUserInput('A'.repeat(256), 18);
    expect(result).toMatch(/invalid/i);
  });
});

// boundary testing
describe('isPriceRange', () => {
  it('should return false when the price is outside the range', () => {
    expect(isPriceInRange(-10, 0, 100)).toBe(false);
    expect(isPriceInRange(200, 0, 100)).toBe(false);
  });
  it('should return true when the price is equal to the min or the max', () => {
    expect(isPriceInRange(0, 0, 100)).toBe(true);
    expect(isPriceInRange(100, 0, 100)).toBe(true);
  });
  it('should return true when the price is within the range', () => {
    expect(isPriceInRange(12, 0, 100)).toBe(true);
  });

  it.each([
    { scenario: 'price < min', price: -10, result: false },
    { scenario: 'price > min', price: 200, result: false },
    { scenario: 'price = min', price: 0, result: true },
    { scenario: 'price = max', price: 100, result: true },
    { scenario: 'price >= min and price <= max', price: 12, result: true },
  ])('should return $result when $scenario', ({ price, result }) => {
    expect(isPriceInRange(price, 0, 100)).toBe(result);
  });
});

describe('isValidUsername', () => {
  const minLength = 5;
  const maxLength = 15;

  it('should return false if length of username is less than 5', () => {
    expect(isValidUsername('a'.repeat(minLength - 1))).toBe(false);
  });
  it('should return false if length of username is greater than 15', () => {
    expect(isValidUsername('a'.repeat(maxLength + 1))).toBe(false);
  });
  it('should return true if length of username is at min or max length', () => {
    expect(isValidUsername('a'.repeat(minLength))).toBe(true);
    expect(isValidUsername('a'.repeat(maxLength))).toBe(true);
  });
  it('should return true if length of username is within the range', () => {
    expect(isValidUsername('a'.repeat(minLength + 1))).toBe(true);
    expect(isValidUsername('a'.repeat(maxLength - 1))).toBe(true);
  });

  it('should return false for invalid input types', () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(1)).toBe(false);
  });
});

describe('canDrive', () => {
  it('should return error if the country code is invalid', () => {
    expect(canDrive(12, 'CN')).toMatch(/invalid/i);
  });
  it('should return false if the age is less than legal driving age in US', () => {
    const result = canDrive(12, 'US');
    expect(result).toBe(false);
  });
  it('should return true for min age in US', () => {
    const result = canDrive(16, 'US');
    expect(result).toBe(true);
  });
  it('should return true for eligible age in US', () => {
    const result = canDrive(17, 'US');
    expect(result).toBe(true);
  });
  it('should return false if the age is less than legal driving age in UK', () => {
    const result = canDrive(16, 'UK');
    expect(result).toBe(false);
  });
  it('should return true for min age in UK', () => {
    const result = canDrive(17, 'UK');
    expect(result).toBe(true);
  });
  it('should return true for eligible age in UK', () => {
    const result = canDrive(18, 'UK');
    expect(result).toBe(true);
  });

  it.each([
    { age: 15, country: 'US', result: false },
    { age: 16, country: 'US', result: true },
    { age: 17, country: 'US', result: true },
    { age: 16, country: 'UK', result: false },
    { age: 17, country: 'UK', result: true },
    { age: 18, country: 'UK', result: true },
  ])('should return $result for $age, $country', ({ age, country, result }) => {
    expect(canDrive(age, country)).toBe(result);
  });
});

// testing asynchronous code
describe('fetchData', () => {
  it('should return a promise that will resolve to an array of numbers', async () => {
    try {
      const result = await fetchData();
      expect(result).instanceOf(Array);
      expect(result.length).greaterThan(0);
    } catch (error) {
      expect(error).toHaveProperty('reason');
      expect(error).toMatch(/fail/i);
    }
  });
});

// testing a class
describe('stack', () => {
  let stack;

  beforeEach(() => {
    stack = new Stack();
  });

  it('should remove the last element from the stack', () => {
    stack.push(4);
    stack.push(5);
    expect(stack.pop()).toBe(5);
  });

  it('pop should throw an error if stack is empty', () => {
    expect(() => stack.pop()).toThrow(/empty/i);
  });

  it('peek should return top of the stack', () => {
    stack.push(4);
    stack.push(9);
    expect(stack.peek()).toBe(9);
  });
  it('peek should throw error is stack is empty', () => {
    expect(() => {
      stack.peek();
    }).toThrow(/empty/i);
  });
  it('should return true if the length of stack is zero', () => {
    expect(stack.isEmpty()).toBe(true);
  });
  it('should return false if stack is not empty', () => {
    stack.push(5);
    expect(stack.isEmpty()).toBe(false);
  });
  it('should return size of stack', () => {
    stack.push(4);
    expect(stack.size()).toBe(1);
  });
  it('clear() should delete all the items from stack', () => {
    stack.push(1);
    stack.push(2);
    stack.clear();
    expect(stack.size()).toBe(0);
  });
});
