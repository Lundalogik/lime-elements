const h = window.LimeElements.h;

class ButtonExample {
    constructor() {
        this.props = {
            label: 'My button',
            primary: true,
            outlined: false,
            icon: null,
            disabled: false,
            loading: false,
        };
    }
    render() {
        return [h("limel-button", Object.assign({}, this.props)), this.renderControls()];
    }
    renderControls() {
        const controls = [
            {
                property: 'label',
                label: 'Label',
                value: 'My button',
            },
            {
                property: 'primary',
                label: 'Primary',
                value: true,
            },
            {
                property: 'outlined',
                label: 'Outlined',
                value: true,
            },
            {
                property: 'icon',
                label: 'Icon',
                value: 'filled_message',
            },
            {
                property: 'disabled',
                label: 'Disabled',
                value: true,
            },
            {
                property: 'loading',
                label: 'Loading',
                value: true,
            },
        ];
        return controls.map(control => {
            return (h("limel-switch", { label: control.label, value: !!this.props[control.property], onChange: event => {
                    this.props = Object.assign({}, this.props, {
                        [control.property]: (event.detail && control.value) || null,
                    });
                } }));
        });
    }
    static get is() { return "limel-example-button"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "props": {
            "state": true
        }
    }; }
    static get style() { return "limel-switch {\n  margin-right: 0.9375rem; }\n\nlimel-button {\n  display: block;\n  margin-bottom: 1.25rem; }"; }
}

export { ButtonExample as LimelExampleButton };
