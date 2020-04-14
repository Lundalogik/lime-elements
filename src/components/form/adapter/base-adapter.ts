import React from 'react';
import { isNil, isNumber, isString, isBoolean } from 'lodash-es';

const toDashCase = myStr =>
    myStr.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`);

// Checks if value is a primitive
const isPrimitive = value =>
    isNil(value) || isNumber(value) || isString(value) || isBoolean(value);

export class LimeElementsAdapter extends React.Component {
    component = null;

    static defaultProps = {
        events: {},
        elementProps: {}
    };

    constructor(
        public props: {
            name: string;
            events?: any;
            elementProps?: any;
        }
    ) {
        super(props);

        this.component = React.createRef();

        this.setComponentProperty = this.setComponentProperty.bind(this);
    }

    setComponentProperty([key, value]: [string, any]) {
        const element = this.component.current;
        element[key] = value;
    }

    getHandler(eventName) {
        const { events } = this.props;
        return event => {
            event.stopPropagation();
            events[eventName](event);
        };
    }

    setEvents() {
        const { events } = this.props;
        const element = this.component.current;
        for (const event of Object.keys(events)) {
            element.addEventListener(event, this.getHandler(event));
        }
    }

    removeEvents() {
        const { events } = this.props;
        const element = this.component.current;
        for (const event of Object.keys(events)) {
            element.removeEventListener(event, events[event]);
        }
    }

    getNonPrimitiveProps(elementProps) {
        const nonPrimitiveProps = {};
        for (const propName of Object.keys(elementProps)) {
            if (!isPrimitive(elementProps[propName])) {
                nonPrimitiveProps[propName] = elementProps[propName];
            }
        }

        return nonPrimitiveProps;
    }

    getPrimitiveProps(elementProps) {
        const primitiveProps = {};
        for (const propName of Object.keys(elementProps)) {
            if (isPrimitive(elementProps[propName])) {
                // Dash case required here but not when setting props manually in `setComponentProperty`.
                // It is assumed that camcelCase props are converted to dash-case, but that is not the case
                // and we end up with props using 'thiscase' <- bad
                primitiveProps[toDashCase(propName)] = elementProps[propName];
            }
        }

        return primitiveProps;
    }

    setNonPrimitives(prevElementProps, elementProps) {
        const nonPrimitiveProps = this.getNonPrimitiveProps(elementProps);
        Object.entries(nonPrimitiveProps)
            .filter(([key, value]) => {
                // If no previous props, set all properties
                if (!prevElementProps) {
                    return true;
                }

                // otherwise check if prop has changed
                return prevElementProps[key] !== value;
            })
            .forEach(this.setComponentProperty);
    }

    componentDidMount() {
        this.setNonPrimitives(null, this.props.elementProps);

        this.setEvents();
    }

    componentWillUnmount() {
        this.removeEvents();
    }

    componentDidUpdate(prevProps) {
        this.setNonPrimitives(prevProps.elementProps, this.props.elementProps);
    }

    render() {
        const { name, elementProps } = this.props;

        return React.createElement(name, {
            ...this.getPrimitiveProps(elementProps),
            ref: this.component
        });
    }
}
