import { h } from './core-804afdbc.js';

const CheckboxTemplate = props => {
    return (h("div", { class: "mdc-form-field " },
        h("div", { class: `
                        mdc-checkbox
                        ${props.disabled ? 'mdc-checkbox--disabled' : ''}
                    ` },
            h("input", { type: "checkbox", class: "mdc-checkbox__native-control", id: props.id, checked: props.checked, disabled: props.disabled, onChange: props.onChange }),
            h("div", { class: "mdc-checkbox__background" },
                h("svg", { class: "mdc-checkbox__checkmark", viewBox: "0 0 24 24" },
                    h("path", { class: "mdc-checkbox__checkmark-path", fill: "none", d: "M1.73,12.91 8.1,19.28 22.79,4.59" })),
                h("div", { class: "mdc-checkbox__mixedmark" }))),
        h("label", { htmlFor: props.id }, props.label)));
};

export { CheckboxTemplate as C };
