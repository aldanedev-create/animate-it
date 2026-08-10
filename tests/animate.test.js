import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { animate } from '../src/animate';
import { defineDirective } from '../src/directive';
describe('animate', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllTimers();
    });
    it('should animate a plain object', () => {
        const obj = { x: 0, y: 0 };
        animate(obj)
            .to({ x: 10, y: 20 })
            .duration(1000)
            .play();
        // Advance time to half
        vi.advanceTimersByTime(500);
        expect(obj.x).toBe(5);
        expect(obj.y).toBe(10);
        vi.advanceTimersByTime(500);
        expect(obj.x).toBe(10);
        expect(obj.y).toBe(20);
    });
    it('should use easing function', () => {
        const obj = { x: 0 };
        animate(obj)
            .to({ x: 10 })
            .duration(1000)
            .ease('inQuad')
            .play();
        vi.advanceTimersByTime(500);
        // inQuad at t=0.5 => 0.25, so x = 2.5
        expect(obj.x).toBe(2.5);
        vi.advanceTimersByTime(500);
        expect(obj.x).toBe(10);
    });
    it('should handle delay', () => {
        const obj = { x: 0 };
        animate(obj)
            .to({ x: 10 })
            .duration(500)
            .delay(300)
            .play();
        vi.advanceTimersByTime(200);
        expect(obj.x).toBe(0);
        vi.advanceTimersByTime(200);
        expect(obj.x).toBeGreaterThan(0);
        vi.advanceTimersByTime(400);
        expect(obj.x).toBe(10);
    });
    it('should repeat animation', () => {
        const obj = { x: 0 };
        animate(obj)
            .to({ x: 10 })
            .duration(500)
            .repeat(2)
            .play();
        vi.advanceTimersByTime(500);
        expect(obj.x).toBe(10);
        vi.advanceTimersByTime(500);
        expect(obj.x).toBe(10); // after second repeat
        vi.advanceTimersByTime(500);
        expect(obj.x).toBe(10); // still at 10
    });
    it('should support yoyo', () => {
        const obj = { x: 0 };
        animate(obj)
            .to({ x: 10 })
            .duration(500)
            .repeat(1)
            .yoyo(true)
            .play();
        vi.advanceTimersByTime(500);
        expect(obj.x).toBe(10);
        vi.advanceTimersByTime(500);
        expect(obj.x).toBe(0);
    });
    it('should call onUpdate callback', () => {
        const obj = { x: 0 };
        const onUpdate = vi.fn();
        animate(obj)
            .to({ x: 10 })
            .duration(1000)
            .onUpdate(onUpdate)
            .play();
        vi.advanceTimersByTime(250);
        expect(onUpdate).toHaveBeenCalledTimes(1);
        expect(onUpdate).toHaveBeenCalledWith(0.25);
        vi.advanceTimersByTime(750);
        expect(onUpdate).toHaveBeenCalledTimes(2);
        expect(onUpdate).toHaveBeenCalledWith(1);
    });
    it('should call onComplete callback', () => {
        const obj = { x: 0 };
        const onComplete = vi.fn();
        animate(obj)
            .to({ x: 10 })
            .duration(500)
            .onComplete(onComplete)
            .play();
        vi.advanceTimersByTime(500);
        expect(onComplete).toHaveBeenCalledTimes(1);
    });
    it('should cancel animation', () => {
        const obj = { x: 0 };
        const onComplete = vi.fn();
        const anim = animate(obj)
            .to({ x: 10 })
            .duration(1000)
            .onComplete(onComplete)
            .play();
        vi.advanceTimersByTime(500);
        anim.cancel();
        vi.advanceTimersByTime(500);
        expect(obj.x).toBe(5); // stopped mid-way
        expect(onComplete).not.toHaveBeenCalled();
    });
    it('should pause and resume', () => {
        const obj = { x: 0 };
        const anim = animate(obj)
            .to({ x: 10 })
            .duration(1000)
            .play();
        vi.advanceTimersByTime(500);
        anim.pause();
        expect(obj.x).toBe(5);
        vi.advanceTimersByTime(500);
        expect(obj.x).toBe(5); // should not change
        anim.resume();
        vi.advanceTimersByTime(500);
        expect(obj.x).toBe(10);
    });
    it('should handle infinite repeat', () => {
        const obj = { x: 0 };
        animate(obj)
            .to({ x: 10 })
            .duration(500)
            .repeat(-1)
            .play();
        for (let i = 0; i < 3; i++) {
            vi.advanceTimersByTime(500);
            expect(obj.x).toBe(10);
            vi.advanceTimersByTime(1);
            // after completion, it should reset and start again
        }
        // We can't easily test infinite loop, just ensure no error
        expect(obj.x).toBe(10);
    });
    it('should use custom directive', () => {
        defineDirective('doubleX', (builder) => {
            const currentX = builder.target.x || 0;
            return builder.to({ x: currentX * 2 });
        });
        const obj = { x: 5 };
        // @ts-ignore
        animate(obj).doubleX().duration(100).play();
        vi.advanceTimersByTime(100);
        expect(obj.x).toBe(10);
    });
    it('should animate nested properties', () => {
        const obj = { position: { x: 0, y: 0 } };
        animate(obj)
            .to({ position: { x: 10, y: 20 } })
            .duration(1000)
            .play();
        vi.advanceTimersByTime(500);
        expect(obj.position.x).toBe(5);
        expect(obj.position.y).toBe(10);
        vi.advanceTimersByTime(500);
        expect(obj.position.x).toBe(10);
        expect(obj.position.y).toBe(20);
    });
    it('should handle zero duration', () => {
        const obj = { x: 0 };
        animate(obj)
            .to({ x: 10 })
            .duration(0)
            .play();
        vi.advanceTimersByTime(0);
        expect(obj.x).toBe(10);
    });
    it('should handle negative duration as zero', () => {
        const obj = { x: 0 };
        animate(obj)
            .to({ x: 10 })
            .duration(-100)
            .play();
        vi.advanceTimersByTime(0);
        expect(obj.x).toBe(10);
    });
});
