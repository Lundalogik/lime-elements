import { getTarget, getHref, prependProtocol } from './link-helper';

describe('limeLinkHelper', () => {
    let element;
    let isValid;
    beforeEach(() => {
        element = {
            checkValidity: () => isValid,
        };
        jest.spyOn(document, 'createElement').mockReturnValueOnce(element);
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
            linksWithTargetBlank.forEach((link) => {
                it('it returns _blank as a target"', () => {
                    expect(getTarget(link.value)).toEqual('_blank');
                });
            });
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
});
