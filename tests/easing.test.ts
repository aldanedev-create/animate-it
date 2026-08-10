import { describe, it, expect } from 'vitest';
import { easing } from '../src/easing';

describe('Easing Functions', () => {
  it('should have linear easing', () => {
    expect(easing.linear(0)).toBe(0);
    expect(easing.linear(0.5)).toBe(0.5);
    expect(easing.linear(1)).toBe(1);
  });

  it('should have inQuad easing', () => {
    expect(easing.inQuad(0)).toBe(0);
    expect(easing.inQuad(0.5)).toBe(0.25);
    expect(easing.inQuad(1)).toBe(1);
  });

  it('should have outQuad easing', () => {
    expect(easing.outQuad(0)).toBe(0);
    expect(easing.outQuad(0.5)).toBe(0.75);
    expect(easing.outQuad(1)).toBe(1);
  });

  it('should have inOutQuad easing', () => {
    expect(easing.inOutQuad(0)).toBe(0);
    expect(easing.inOutQuad(0.25)).toBe(0.125);
    expect(easing.inOutQuad(0.5)).toBe(0.5);
    expect(easing.inOutQuad(0.75)).toBe(0.875);
    expect(easing.inOutQuad(1)).toBe(1);
  });

  it('should have inCubic easing', () => {
    expect(easing.inCubic(0)).toBe(0);
    expect(easing.inCubic(0.5)).toBe(0.125);
    expect(easing.inCubic(1)).toBe(1);
  });

  it('should have outBounce easing', () => {
    expect(easing.outBounce(0)).toBe(0);
    expect(easing.outBounce(0.4)).toBeCloseTo(0.484, 2);
    expect(easing.outBounce(0.6)).toBeCloseTo(0.9375, 2);
    expect(easing.outBounce(1)).toBe(1);
  });

  it('should have inOutBack easing', () => {
    expect(easing.inOutBack(0)).toBe(0);
    expect(easing.inOutBack(0.5)).toBeCloseTo(0.5, 2);
    expect(easing.inOutBack(1)).toBe(1);
  });

  it('should handle edge cases (t = 0 and 1)', () => {
    const names = Object.keys(easing) as (keyof typeof easing)[];
    for (const name of names) {
      expect(easing[name](0)).toBe(0);
      expect(easing[name](1)).toBe(1);
    }
  });
});