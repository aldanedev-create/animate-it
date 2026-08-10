import { describe, it, expect } from 'vitest';
import { defineDirective, getDirective } from '../src/directive';
describe('Directives', () => {
    it('should define a directive', () => {
        const fn = (builder, value) => ({ ...builder, value });
        defineDirective('testDirective', fn);
        const registered = getDirective('testDirective');
        expect(registered).toBe(fn);
    });
    it('should define and use a directive', () => {
        defineDirective('addFive', (builder, num) => {
            return { ...builder, result: num + 5 };
        });
        const directive = getDirective('addFive');
        expect(directive).toBeDefined();
        if (directive) {
            const result = directive({}, 10);
            expect(result.result).toBe(15);
        }
    });
    it('should allow directives to modify builder', () => {
        defineDirective('setDuration', (builder, duration) => {
            builder.duration = duration;
            return builder;
        });
        const directive = getDirective('setDuration');
        expect(directive).toBeDefined();
        if (directive) {
            const builder = { duration: 100 };
            const result = directive(builder, 500);
            expect(result.duration).toBe(500);
        }
    });
    it('should handle multiple directives', () => {
        defineDirective('toUpper', (str) => str.toUpperCase());
        defineDirective('toLower', (str) => str.toLowerCase());
        const upper = getDirective('toUpper');
        const lower = getDirective('toLower');
        expect(upper).toBeDefined();
        expect(lower).toBeDefined();
        if (upper && lower) {
            expect(upper('hello')).toBe('HELLO');
            expect(lower('WORLD')).toBe('world');
        }
    });
    it('should return undefined for undefined directive', () => {
        expect(getDirective('nonExistent')).toBeUndefined();
    });
});
