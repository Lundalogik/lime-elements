import React from 'react';
import { isNil, isNumber, isString, isBoolean } from 'lodash-es';

// Convert camelCase to dash-case
const toDashCase = myStr =>
    myStr.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`);

// Checks if value is a primitive
const isPrimitive = value =>
    isNil(value) || isNumber(value) || isString(value) || isBoolean(value);

/**
 * Renders a webcomponent by name
 */
export class LimeElementsAdapter extends React.Component<any, any> {
    component = null;

    static defaultProps = {
        // The events to bind the the web component
        events: {},
        // The props to pass to the web component
        elementProps: {},
    };

    constructor(
        public props: {
            name: string;
            events?: any;
            elementProps?: any;
        }
    ) {
        super(props);

        this.state = {
            prevEvents: {},
        };

        this.component = React.createRef();

        this.setComponentProperty = this.setComponentProperty.bind(this);
    }

    // Sets a property on the web component
    setComponentProperty([key, value]: [string, any]) {
        const element = this.component.current;
        element[key] = value;
    }

    /**
     * Get the handler for an event.
     *
     * The handler stop propagation otherwise. Should be used instead of just binding
     * the handler passed in the `events` prop due to this reason
     *
     * @param {string} eventName the name of the event to get the handler for
     *
     * @returns {any} the handler to bind to the component for the event name
     */
    getHandler(eventName: string) {
        const { events } = this.props;
        return event => {
            event.stopPropagation();
            events[eventName](event);
        };
    }

    /**
     * Set events on the web component
     *
     * @param {object} events Event names to handlers
     *
     * @returns {void}
     */
    setEvents(events: object) {
        const element = this.component.current;
        for (const event of Object.keys(events)) {
            element.addEventListener(event, this.getHandler(event));
        }
    }

    /**
     * Remove events on the web component
     *
     * @param {object} events Event names to handlers
     *
     * @returns {void}
     */
    removeEvents(events: object) {
        const element = this.component.current;
        for (const event of Object.keys(events)) {
            element.removeEventListener(event, events[event]);
        }
    }

    /**
     * Detect if event handlers have changed. If they
     * have changed, store them in the state, and remove and
     * re-add the changed event handlers
     *
     * @returns {void}
     */
    updateEvents() {
        const { prevEvents } = this.state;
        const { events } = this.props;

        const eventsToAdd = {};
        const eventsToRemove = {};
        let eventsChanged = false;
        for (const eventName of Object.keys(events)) {
            if (prevEvents[eventName] !== events[eventName]) {
                eventsToAdd[eventName] = events[eventName];
                eventsToRemove[eventName] = prevEvents[eventName];
                eventsChanged = true;
            }
        }

        if (eventsChanged) {
            this.setState({ prevEvents: events });
        }

        this.removeEvents(eventsToRemove);
        this.setEvents(eventsToAdd);
    }

    /**
     * Get non primitive props. i.e. object, function, array, etc
     *
     * @param {object} elementProps the props to pass the webcomponet
     *
     * @returns {object} non primitive props
     */
    getNonPrimitiveProps(elementProps: object) {
        const nonPrimitiveProps = {};
        for (const propName of Object.keys(elementProps)) {
            if (!isPrimitive(elementProps[propName])) {
                nonPrimitiveProps[propName] = elementProps[propName];
            }
        }

        return nonPrimitiveProps;
    }

    /**
     * Get primitive props. i.e. integer, boolean, etc
     *
     * @param {object} elementProps the props to pass the webcomponet
     *
     * @returns {object} primitive props
     */
    getPrimitiveProps(elementProps: object) {
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

    /**
     * Set non primitive props on the web component. We have to set non primitive props
     * via the setComponentProperty instead of passing them as props the the React.createElement
     * function because non primitive props are not passed properly to the web
     * component via React.createElement
     *
     * @param {object} prevElementProps element props from previous render
     * @param {object} elementProps element props for the current render
     *
     * @returns {void}
     */
    setNonPrimitives(prevElementProps: object, elementProps: object) {
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
        this.updateEvents();
    }

    componentWillUnmount() {
        this.removeEvents(this.state.prevEvents);
    }

    componentDidUpdate(prevProps) {
        this.setNonPrimitives(prevProps.elementProps, this.props.elementProps);
        this.updateEvents();
    }

    render() {
        const { name, elementProps } = this.props;

        return React.createElement(name, {
            ...this.getPrimitiveProps(elementProps),
            ref: this.component,
        });
    }
}
