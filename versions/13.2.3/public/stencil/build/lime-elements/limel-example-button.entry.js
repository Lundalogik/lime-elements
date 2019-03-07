const h = window.LimeElements.h;

class ButtonExample {
    componentDidLoad() {
        this.buttonWithClickHandler = this.hostElement.shadowRoot.querySelector('#buttonWithClickHandler');
    }
    render() {
        return [
            h("section", null,
                h("h3", null, "Default"),
                h("p", null,
                    h("limel-button", { label: "Primary", primary: true })),
                h("p", null,
                    h("limel-button", { label: "Secondary" }))),
            h("section", null,
                h("h3", null, "Disabled"),
                h("p", null,
                    h("limel-button", { label: "Primary", primary: true, disabled: true })),
                h("p", null,
                    h("limel-button", { label: "Secondary", disabled: true }))),
            h("section", null,
                h("h3", null, "Loading"),
                h("p", null,
                    h("limel-button", { label: "Primary", primary: true, loading: true })),
                h("p", null,
                    h("limel-button", { label: "Secondary", loading: true }))),
            h("section", null,
                h("h3", null, "Disabled & loading"),
                h("p", null,
                    h("limel-button", { label: "Primary", primary: true, disabled: true, loading: true })),
                h("p", null,
                    h("limel-button", { label: "Secondary", disabled: true, loading: true }))),
            h("section", null,
                h("h3", null, "With click handler"),
                h("p", null,
                    "The click handler in this example sets the attributes",
                    ' ',
                    h("code", null, "loading"),
                    " and ",
                    h("code", null, "disabled"),
                    " to",
                    ' ',
                    h("code", null, "true"),
                    ". After 1 second, the ",
                    h("code", null, "loading"),
                    ' ',
                    "attribute is set to ",
                    h("code", null, "false"),
                    " again. After another 4 seconds, the button is once again enabled."),
                h("p", null,
                    "When the ",
                    h("code", null, "loading"),
                    " attribute changes from",
                    ' ',
                    h("code", null, "true"),
                    " to ",
                    h("code", null, "false"),
                    ", the button automatically displays a checkmark icon for 2 seconds. Note that our click handler isn't actually involved in this."),
                h("p", null,
                    h("limel-button", { id: "buttonWithClickHandler", label: "Click me!", primary: true, onClick: () => {
                            this.onClick();
                        } }))),
        ];
    }
    onClick() {
        const button = this.buttonWithClickHandler;
        button.setAttribute('disabled', 'true');
        button.setAttribute('loading', 'true');
        const TIME_LOADING = 1000;
        const TIME_DISABLED = 4000;
        setTimeout(() => {
            button.setAttribute('loading', 'false');
            setTimeout(() => {
                button.setAttribute('disabled', 'false');
            }, TIME_DISABLED);
        }, TIME_LOADING);
    }
    static get is() { return "limel-example-button"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "hostElement": {
            "elementRef": true
        }
    }; }
}

export { ButtonExample as LimelExampleButton };
