import { getFactoryProps } from './schema-field';

describe('getFactoryProps', () => {
    describe('when no factory is given', () => {
        it('returns an empty object', () => {
            const props = getFactoryProps({}, {});
            expect(props).toEqual({});
        });
    });

    describe('when a factory is set', () => {
        describe('when the factory returns an object', () => {
            it('returns the props from the factory', () => {
                const props = getFactoryProps(
                    {
                        propsFactory: () => ({ foo: 'bar' }),
                    },
                    {}
                );
                expect(props).toEqual({ foo: 'bar' });
            });
        });

        describe('when the factory not returns an object', () => {
            it('returns an empty object', () => {
                const props = getFactoryProps(
                    {
                        propsFactory: () => null,
                    },
                    {}
                );
                expect(props).toEqual({});
            });
        });
    });
});
