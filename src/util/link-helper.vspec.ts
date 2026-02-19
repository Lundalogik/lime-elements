import { getTarget, getHref, prependProtocol, getRel } from './link-helper';

describe('limeLinkHelper', () => {
    let element;
    let isValid;
    beforeEach(() => {
        element = {
            checkValidity: () => isValid,
        };
        vi.spyOn(document, 'createElement').mockReturnValueOnce(element);
    });
    describe('when input is a relative link', () => {
        it('is NOT prepended with http:// for links starting with one "/"', () => {
            expect(getHref('/test/hej')).toEqual('/test/hej');
        });
        it('is NOT prepended with http:// for links starting with "#"', () => {
            expect(getHref('#test/hej')).toEqual('#test/hej');
        });
    });

    describe('when input begins with "//"', () => {
        it('is NOT prepended with http://', () => {
            expect(getHref('//test/hej')).toEqual('//test/hej');
        });
    });

    describe('when input begins with "ftp:"', () => {
        it('is NOT prepended with http://', () => {
            expect(getHref('ftp://limetest@web')).toEqual('ftp://limetest@web');
        });
    });

    describe('when input begins with "https"', () => {
        it('is NOT prepended with http://', () => {
            expect(getHref('https://limetest@web')).toEqual(
                'https://limetest@web'
            );
        });
    });

    describe('getTarget"', () => {
        describe('when url is a relative link', () => {
            it('it returns _self as a target', () => {
                expect(getTarget('#test/hej')).toEqual('_self');
            });
        });
        describe('when url is not relative link "', () => {
            const linksWithTargetBlank = [
                {
                    type: 'http',
                    value: 'http://one.com',
                },
                {
                    type: 'https',
                    value: 'https://two.com',
                },
                {
                    type: 'ftp',
                    value: 'ftp://five.com',
                },
                {
                    type: 'ftps',
                    value: 'ftps://six.com',
                },
                {
                    type: 'arbitrary',
                    value: 'eight.com',
                },
            ];
            for (const link of linksWithTargetBlank) {
                it('it returns _blank as a target"', () => {
                    expect(getTarget(link.value)).toEqual('_blank');
                });
            }
        });
    });
    describe('prependProtocol', () => {
        describe('with typical non-relative link missing protocol', () => {
            it('prepends value with https://', () => {
                isValid = true;
                expect(prependProtocol('lime.tech')).toEqual(
                    'https://lime.tech'
                );
            });
        });
        describe('with an empty string', () => {
            it('does not alter input', () => {
                isValid = false;
                expect(prependProtocol('')).toEqual('');
            });
        });
    });

    describe('getRel', () => {
        for (const { description, target, explicitRel, expected } of [
            {
                description:
                    'returns "noopener noreferrer" for target="_blank"',
                target: '_blank',
                explicitRel: undefined,
                expected: 'noopener noreferrer',
            },
            {
                description:
                    'returns "noopener noreferrer" for target="_BLANK" (case-insensitive)',
                target: '_BLANK',
                explicitRel: undefined,
                expected: 'noopener noreferrer',
            },
            {
                description:
                    'returns "noopener noreferrer" when target has surrounding whitespace',
                target: ' _blank ',
                explicitRel: undefined,
                expected: 'noopener noreferrer',
            },
            {
                description: 'returns undefined for other targets',
                target: '_self',
                explicitRel: undefined,
                expected: undefined,
            },
            {
                description: 'returns undefined if target is not set',
                target: undefined,
                explicitRel: undefined,
                expected: undefined,
            },
            {
                description: 'prioritizes explicitRel over target',
                target: '_blank',
                explicitRel: 'custom',
                expected: 'custom',
            },
            {
                description: 'trims whitespace from explicitRel',
                target: '_blank',
                explicitRel: '  custom  ',
                expected: 'custom',
            },
            {
                description:
                    'returns undefined if explicitRel consists only of whitespace',
                target: '_blank',
                explicitRel: '   ',
                expected: undefined,
            },
            {
                description:
                    'returns undefined if explicitRel is an empty string',
                target: '_blank',
                explicitRel: '',
                expected: undefined,
            },
        ]) {
            it(description, () => {
                expect(getRel(target, explicitRel)).toBe(expected);
            });
        }
    });
});
