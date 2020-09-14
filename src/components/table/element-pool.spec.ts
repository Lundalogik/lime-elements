import { ElementPool } from './element-pool';

describe('ElementPool', () => {
    let pool: ElementPool;

    beforeEach(() => {
        pool = new ElementPool(document);
    });

    describe('get', () => {
        it('returns an element', () => {
            const foo = pool.get('foo');
            expect(foo).toBeTruthy();
        });

        describe('when called multiple times', () => {
            it('returns different elements', () => {
                const foo1 = pool.get('foo');
                expect(foo1).toBeTruthy();

                const foo2 = pool.get('foo');
                expect(foo2).toBeTruthy();

                expect(foo1).not.toBe(foo2);
            });
        });
    });

    describe('release', () => {
        it('makes `get` return the released element again', () => {
            const foo1 = pool.get('foo');
            pool.release(foo1);

            const foo2 = pool.get('foo');

            expect(foo1).toBe(foo2);
        });

        describe('when getting an element with different name', () => {
            it('still creates a new element', () => {
                const foo = pool.get('foo');
                pool.release(foo);

                const bar = pool.get('bar');

                expect(foo).not.toBe(bar);
            });
        });
    });

    describe('releaseAll', () => {
        it('releases all elements in the pool', () => {
            const foo1 = pool.get('foo');
            const foo2 = pool.get('foo');
            const bar = pool.get('bar');

            pool.releaseAll();

            expect(pool.get('foo')).toBe(foo1);
            expect(pool.get('foo')).toBe(foo2);
            expect(pool.get('bar')).toBe(bar);
        });
    });

    describe('clear', () => {
        it('removes all elements in the pool', () => {
            const foo1 = pool.get('foo');
            const foo2 = pool.get('foo');
            const bar = pool.get('bar');

            pool.clear();

            expect(pool.get('foo')).not.toBe(foo1);
            expect(pool.get('foo')).not.toBe(foo2);
            expect(pool.get('bar')).not.toBe(bar);
        });
    });
});
