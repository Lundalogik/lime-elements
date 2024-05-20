import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { TextEditor } from './text-editor';
import { h } from '@stencil/core';
import { getAttributesRecursively } from '../../util/get-attributes';
import { mapValues } from 'lodash-es';

let page: SpecPage;
let textEditor: HTMLLimelTextEditorElement;

describe('limel-text-editor', () => {
    test('the component renders', async () => {
        await createPage();

        expect(textEditor).not.toBeFalsy();

        const ariaControls = [];
        const ids = [];
        getAttributesRecursively(textEditor, ariaControls, 'aria-controls');
        getAttributesRecursively(textEditor, ids, 'id');

        expect(textEditor)
            .toEqualHtml(`<limel-text-editor allow-resize="" language="en">
        <mock:shadow-root>
          <span class="notched-outline">
            <span class="leading-outline"></span>
            <span class="trailing-outline"></span>
          </span>
          <limel-prosemirror-adapter aria-controls=${ariaControls[0]} contenttype="markdown" id=${ids[0]} language="en" tabindex="0"></limel-prosemirror-adapter>
        </mock:shadow-root>
      </limel-text-editor>`);
    });

    test.each([
        [
            {
                contentType: { attribute: 'contentType', value: 'html' },
                value: { attribute: 'value', value: '<p>test</p>' },
            },
            ['html', '<p>test</p>'],
        ],
        [
            {
                contentType: { attribute: 'contentType', value: 'markdown' },
                value: { attribute: 'value', value: 'test' },
            },
            ['markdown', 'test'],
        ],
        [
            {
                value: { attribute: 'value', value: 'test' },
                placeholder: {
                    attribute: 'aria-placeholder',
                    value: 'test placeholder',
                },
            },
            ['test', 'test placeholder'],
        ],
        [
            {
                value: { attribute: 'value', value: 'test' },
                disabled: { attribute: 'aria-disabled', value: false },
            },
            ['test', null],
        ],
        [
            {
                value: { attribute: 'value', value: 'test' },
                disabled: { attribute: 'aria-disabled', value: true },
            },
            ['test', ''],
        ],
        [
            {
                value: { attribute: 'value', value: 'test' },
                disabled: { attribute: 'tabindex', value: false },
            },
            ['test', '0'],
        ],
        [
            {
                value: { attribute: 'value', value: 'test' },
                disabled: { attribute: 'tabindex', value: true },
            },
            ['test', '-1'],
        ],
    ])(
        'Props get passed down into the adapter',
        async (
            props: { [key: string]: { attribute: string; value: any } },
            expected: string[],
        ) => {
            await createPage(mapValues(props, 'value'));

            expect(
                Object.values(props).map(
                    (prop: { attribute: string; value: any }) => {
                        return textEditor.shadowRoot
                            .querySelector('limel-prosemirror-adapter')
                            .getAttribute(prop.attribute);
                    },
                ),
            ).toEqual(expected);
        },
    );

    describe('placeholder', () => {
        beforeEach(async () => {
            await createPage({ placeholder: 'my placeholder' });
        });

        test('the placeholder is rendered', async () => {
            const placeholder =
                textEditor.shadowRoot.querySelector('.placeholder');
            expect(placeholder).not.toBeFalsy();
        });
    });

    describe('helpertext', () => {
        test('the helper line is rendered', async () => {
            await createPage({ helperText: 'my helpertext' });

            const helperline =
                textEditor.shadowRoot.querySelector('limel-helper-line');

            expect(helperline).not.toBeFalsy();
            expect(helperline.getAttribute('helperText')).toEqual(
                'my helpertext',
            );
        });

        test('if invalid and not readonly, the helper line is also invalid', async () => {
            await createPage({
                helperText: 'my helpertext',
                readonly: false,
                invalid: true,
            });
            const helperline =
                textEditor.shadowRoot.querySelector('limel-helper-line');

            expect(helperline.getAttribute('invalid')).toEqual('');
        });
    });

    describe('label', () => {
        beforeEach(async () => {
            await createPage({ label: 'my label' });
        });

        test('it renders the label', () => {
            const label = textEditor.shadowRoot.querySelector('label');

            expect(label.innerHTML).toEqual('my label');
        });
    });
});

async function createPage(props: any = {}) {
    const {
        allowResize,
        contentType,
        disabled,
        helperText,
        invalid,
        label,
        placeholder,
        readonly,
        required,
        value,
    } = props;

    page = await newSpecPage({
        components: [TextEditor],
        template: () => {
            return (
                <limel-text-editor
                    allowResize={allowResize}
                    contentType={contentType}
                    disabled={disabled}
                    helperText={helperText}
                    invalid={invalid}
                    label={label}
                    placeholder={placeholder}
                    readonly={readonly}
                    required={required}
                    value={value}
                />
            );
        },
    });

    await page.waitForChanges();

    textEditor = page.body.querySelector('limel-text-editor');
}
