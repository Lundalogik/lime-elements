import { vi } from 'vitest';
import { DeferredDestroy } from './deferred-destroy';

let deferredDestroy: DeferredDestroy;

beforeEach(() => {
    vi.useFakeTimers();
    deferredDestroy = new DeferredDestroy();
});

afterEach(() => {
    vi.useRealTimers();
});

test('schedule does not call the callback synchronously', () => {
    const callback = vi.fn();
    deferredDestroy.schedule(callback);

    expect(callback).not.toHaveBeenCalled();
});

test('schedule calls the callback after the microtask completes', () => {
    const callback = vi.fn();
    deferredDestroy.schedule(callback);
    vi.runAllTimers();

    expect(callback).toHaveBeenCalledTimes(1);
});

test('cancel prevents the callback from firing', () => {
    const callback = vi.fn();
    deferredDestroy.schedule(callback);
    deferredDestroy.cancel();
    vi.runAllTimers();

    expect(callback).not.toHaveBeenCalled();
});

test('cancel is safe to call when nothing is scheduled', () => {
    expect(() => deferredDestroy.cancel()).not.toThrow();
});

test('scheduling twice only fires the second callback', () => {
    const first = vi.fn();
    const second = vi.fn();
    deferredDestroy.schedule(first);
    deferredDestroy.schedule(second);
    vi.runAllTimers();

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
});

test('schedule works after a previous cancel', () => {
    const first = vi.fn();
    const second = vi.fn();
    deferredDestroy.schedule(first);
    deferredDestroy.cancel();
    deferredDestroy.schedule(second);
    vi.runAllTimers();

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
});

test('schedule works after a previous callback has fired', () => {
    const first = vi.fn();
    const second = vi.fn();
    deferredDestroy.schedule(first);
    vi.runAllTimers();
    deferredDestroy.schedule(second);
    vi.runAllTimers();

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
});
