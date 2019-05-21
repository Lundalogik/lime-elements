const h = window.LimeElements.h;

class IconBackgroundExample {
    render() {
        return [
            h("limel-icon", { badge: true, class: "company", name: "organization", size: "x-small" }),
            h("limel-icon", { badge: true, class: "person", name: "user_group_man_man", size: "small" }),
            h("limel-icon", { badge: true, class: "deal", name: "money", size: "medium" }),
            h("limel-icon", { badge: true, class: "campaign", name: "megaphone", size: "large" }),
        ];
    }
    static get is() { return "limel-example-icon-background"; }
    static get encapsulation() { return "shadow"; }
    static get style() { return ":host(limel-example-icon-background) {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n}\n:host(limel-example-icon-background) limel-icon {\n  color: white;\n  margin-bottom: 0.625rem;\n}\n:host(limel-example-icon-background) limel-icon.company {\n  background-color: var(--lime-blue);\n}\n:host(limel-example-icon-background) limel-icon.person {\n  background-color: var(--lime-orange);\n}\n:host(limel-example-icon-background) limel-icon.deal {\n  background-color: var(--lime-green);\n}\n:host(limel-example-icon-background) limel-icon.campaign {\n  background-color: var(--lime-deep-red);\n}"; }
}

export { IconBackgroundExample as LimelExampleIconBackground };
