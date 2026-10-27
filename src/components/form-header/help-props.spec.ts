import { getHelpProps } from './help-props';

test('a help string is the value of the help', () => {
    expect(getHelpProps('Use the work number')).toEqual({
        value: 'Use the work number',
    });
});

test('keeps the properties that limel-help has', () => {
    const readMoreLink = { href: 'https://example.com', text: 'Read more' };

    expect(
        getHelpProps({
            value: 'Use the work number',
            trigger: 'Tip',
            openDirection: 'top',
            readMoreLink: readMoreLink,
        })
    ).toEqual({
        value: 'Use the work number',
        trigger: 'Tip',
        openDirection: 'top',
        readMoreLink: readMoreLink,
    });
});

test('leaves out the keys that are not a property of the help', () => {
    const help = {
        value: 'Use the work number',
        innerHTML: '<b>Hello</b>',
        outerHTML: '<b>Hello</b>',
    };

    expect(getHelpProps(help)).toEqual({ value: 'Use the work number' });
});
