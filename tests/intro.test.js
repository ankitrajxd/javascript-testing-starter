import { describe, it, expect } from 'vitest';
import { calculateAverage, factorial, fizzBuzz, max } from '../src/intro';

describe('max', () => {
  it('should return the first argument if it is greater', () => {
    expect(max(2, 1)).toBe(2);
  });
  it('should return the second argument if it is greater', () => {
    expect(max(1, 2)).toBe(2);
  });
  it('should return the first argument if it arguments are equal', () => {
    expect(max(1, 1)).toBe(1);
  });
});

describe('fizzBuzz', () => {
  it('should return FizzBuzz if the argument is divisible by both 3 and 5', () => {
    expect(fizzBuzz(15)).toBe('FizzBuzz');
  });
  it('should return Fizz if the argument is divisible 3 only', () => {
    expect(fizzBuzz(9)).toBe('Fizz');
  });
  it('should return Buzz if the argument is divisible by 5 only', () => {
    expect(fizzBuzz(10)).toBe('Buzz');
  });
  it('should return same argument as string if the argument is something else', () => {
    expect(fizzBuzz(17)).toBe('17');
  });
});

describe('calculateAverage', () => {
  it('should return NaN if given an empty array.', () => {
    expect(calculateAverage([])).toBe(NaN);
  });
  it('should calculate the average of an array with a single element', () => {
    expect(calculateAverage([1])).toBe(1);
  });
  it('should calculate the average of an array with two elements', () => {
    expect(calculateAverage([1, 2])).toBe(1.5);
  });
  it('should calculate the average of an array with three elements', () => {
    expect(calculateAverage([1, 2, 3])).toBe(2);
  });
});

describe('factorial', () => {
  it('should return 1 if the argument is either 0 or 1', () => {
    expect(factorial(0)).toBe(1);
    expect(factorial(1)).toBe(1);
  });
  it('should return 6 if given 3', () => {
    expect(factorial(3)).toBe(6);
  });
  it('should return 24 if given 4', () => {
    expect(factorial(4)).toBe(24);
  });
  it('should return undefined if given a negative number', () => {
    expect(factorial(-1)).toBeUndefined();
  });
});
