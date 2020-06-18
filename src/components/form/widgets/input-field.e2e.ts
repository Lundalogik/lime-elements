import { newE2EPage } from '@stencil/core/testing';

describe('form input-field', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    const schema = {
        title: 'Registration form',
        type: 'object',
        properties: {
            name: {
                type: 'string',
                title: 'Name',
                default: '',
                description: 'Enter your heroic name',
            },
        },
    };
    const props = { schema };

    await page.setContent('<div></div>');
    await page.$eval('div', (elm: any, { schema }) => {
        const form = document.createElement('limel-form');
        form.schema = schema;
        elm.appendChild(form);
    }, props);

    await page.waitForChanges();
    const form = await page.find('limel-form');
    expect(form).toHaveClass('hydrated');

    const limelInput = await page.find('limel-form >>> limel-input-field');
    expect(limelInput).toHaveClass('hydrated');

    await page.waitForChanges();
    await page.waitForChanges();
    await page.waitForChanges();
    const inp = await form.find('limel-input-field >>> .mdc-text-field__input');
    console.log('input', inp, '\n\n-----\n\n-----\n\n-----\n\n');
    console.log('\n\n-----\n\n-----\n\n-----\n\n');

    // await page.debugger();

    await page.$eval('div', () => {
        const input = document.querySelector('limel-form').shadowRoot.querySelector('limel-input-field').shadowRoot.querySelector('input');
        input.focus();
        const eventA = new KeyboardEvent('keypress', {
            bubbles: true,
            cancelable: true,
            code: 'KeyA',
            composed: true,
            key: 'a',
        });
        input.dispatchEvent(eventA);
    });

    // console.log('limel-form', form.nodeName);
    // console.log('div', form.shadowRoot.childNodes[0].nodeName);
    // console.log('form', form.shadowRoot.childNodes[0].childNodes[0].nodeName);
    // console.log('div', form.shadowRoot.childNodes[0].childNodes[0].childNodes[0].nodeName);
    // console.log('div', form.shadowRoot.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName);
    // console.log('h1', form.shadowRoot.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName);
    // console.log('div', form.shadowRoot.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].nodeName);
    // console.log('limel-input-field', form.shadowRoot.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].nodeName);
    // // console.log('limel-input-field', limelInput.nodeName);
    // console.log('label', limelInput.shadowRoot.childNodes[0].nodeName);
    // console.log('input', limelInput.shadowRoot.childNodes[0].childNodes[0], '----\n\n');
    //
    // const input = limelInput.shadowRoot.childNodes[0].childNodes[0];
    //
    // console.log('input', input);

    // let value = await input.getProperty('value');
    // expect(value).toBe('');
    //
    // await input.press('8');
    // await input.press('8');
    // await input.press(' ');
    //
    // await page.keyboard.down('Shift');
    // await input.press('KeyM');
    // await input.press('KeyP');
    // await input.press('KeyH');
    // await page.keyboard.up('Shift');

    await page.waitForChanges();
    let value2 = await limelInput.getProperty('value');
    expect(value2).toBe('a');
  });
});
