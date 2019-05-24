const h = window.LimeElements.h;

class FlexContainer {
    constructor() {
        /**
         * Direction of the main axis
         */
        this.direction = 'horizontal';
        /**
         * Specify how items are aligned along the main axis
         */
        this.justify = 'space-between';
        /**
         * Specify how items are aligned along the cross axis
         */
        this.align = 'center';
        /**
         * Reverse the order of the items
         */
        this.reverse = false;
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "limel-flex-container"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "align": {
            "type": String,
            "attr": "align",
            "reflectToAttr": true
        },
        "direction": {
            "type": String,
            "attr": "direction",
            "reflectToAttr": true
        },
        "justify": {
            "type": String,
            "attr": "justify",
            "reflectToAttr": true
        },
        "reverse": {
            "type": Boolean,
            "attr": "reverse",
            "reflectToAttr": true
        }
    }; }
    static get style() { return ":host(limel-flex-container) {\n  display: -ms-flexbox;\n  display: flex;\n}\n\n:host(limel-flex-container[hidden]) {\n  display: none;\n}\n\n:host(limel-flex-container[direction=horizontal]) {\n  -ms-flex-direction: row;\n  flex-direction: row;\n}\n\n:host(limel-flex-container[direction=horizontal][reverse]) {\n  -ms-flex-direction: row-reverse;\n  flex-direction: row-reverse;\n}\n\n:host(limel-flex-container[direction=vertical]) {\n  -ms-flex-direction: column;\n  flex-direction: column;\n}\n\n:host(limel-flex-container[direction=vertical][reverse]) {\n  -ms-flex-direction: column-reverse;\n  flex-direction: column-reverse;\n}\n\n:host(limel-flex-container[align=start]) {\n  -ms-flex-align: start;\n  align-items: flex-start;\n}\n\n:host(limel-flex-container[align=end]) {\n  -ms-flex-align: end;\n  align-items: flex-end;\n}\n\n:host(limel-flex-container[align=center]) {\n  -ms-flex-align: center;\n  align-items: center;\n}\n\n:host(limel-flex-container[align=stretch]) {\n  -ms-flex-align: stretch;\n  align-items: stretch;\n}\n\n:host(limel-flex-container[justify=start]) {\n  -ms-flex-pack: start;\n  justify-content: flex-start;\n}\n\n:host(limel-flex-container[justify=end]) {\n  -ms-flex-pack: end;\n  justify-content: flex-end;\n}\n\n:host(limel-flex-container[justify=center]) {\n  -ms-flex-pack: center;\n  justify-content: center;\n}\n\n:host(limel-flex-container[justify=space-between]) {\n  -ms-flex-pack: justify;\n  justify-content: space-between;\n}\n\n:host(limel-flex-container[justify=space-around]) {\n  -ms-flex-pack: distribute;\n  justify-content: space-around;\n}\n\n:host(limel-flex-container[justify=space-evenly]) {\n  -ms-flex-pack: space-evenly;\n  justify-content: space-evenly;\n}"; }
}

export { FlexContainer as LimelFlexContainer };
