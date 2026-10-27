import { FormSchema } from '../form.types';
import { getHelpComponent } from './help';

function schemaWithHelp(help: unknown): FormSchema {
    return { type: 'string', lime: { help } } as FormSchema;
}

test('draws no help when the schema has none', () => {
    expect(getHelpComponent({ type: 'string' })).toBeUndefined();
});

test('uses a help string as the value of the help', () => {
    const element = getHelpComponent(schemaWithHelp('Use the work number'));

    expect(element.props).toEqual({ value: 'Use the work number' });
});

test('adds the extra props to the help', () => {
    const element = getHelpComponent(schemaWithHelp('Use the work number'), {
        slot: 'help',
    });

    expect(element.props).toEqual({
        value: 'Use the work number',
        slot: 'help',
    });
});

test('leaves out the keys that are not a property of the help', () => {
    const element = getHelpComponent(
        schemaWithHelp({
            value: 'Use the work number',
            trigger: 'Tip',
            outerHTML: '<b>Hello</b>',
        })
    );

    expect(element.props).toEqual({
        value: 'Use the work number',
        trigger: 'Tip',
    });
});
