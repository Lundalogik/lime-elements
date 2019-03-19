const h = window.LimeElements.h;

class ButtonGroupExample {
    render() {
        return [
            h("section", null,
                h("h3", null, "Default"),
                h("limel-button-group", null,
                    h("limel-button", { label: "Save", primary: true }),
                    h("limel-button", { label: "Cancel" }))),
            h("section", null,
                h("h3", null, "Reverse order"),
                h("limel-button-group", { class: "reverse-order" },
                    h("limel-button", { label: "Save", primary: true }),
                    h("limel-button", { label: "Cancel" }))),
            h("section", null,
                h("h3", null, "Centered"),
                h("limel-button-group", { class: "center" },
                    h("limel-button", { label: "Save", primary: true }),
                    h("limel-button", { label: "Cancel" }))),
            h("section", null,
                h("h3", null, "Centered & reverse order"),
                h("limel-button-group", { class: "center reverse-order" },
                    h("limel-button", { label: "Save", primary: true }),
                    h("limel-button", { label: "Cancel" }))),
        ];
    }
    static get is() { return "limel-example-button-group"; }
    static get encapsulation() { return "shadow"; }
}

export { ButtonGroupExample as LimelExampleButtonGroup };
