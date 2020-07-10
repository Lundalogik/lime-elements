import React from 'react';
import {
    isNil,
    isNumber,
    isString,
    isBoolean,
    pickBy,
    negate,
    kebabCase,
    mapKeys,
    has,
    isEmpty,
    toPairs,
    isEqual,
} from 'lodash-es';

/**
 * Given a value, check if it is primitive or not
 *
 * This function treats the definition of primitive a little differently than
 * the real definition of a primitive in javascript. In this context, primitive
 * really means "can be properly rendered to the dom by react". It just so
 * happens that react can render most primitives to the dom correctly.
 *
 * @see https://developer.mozilla.org/en-US/docs/Glossary/Primitive
 *
 * @param {any} value the value to check
 *
 * @returns {boolean} Whether or not the value is primitive
 */
const isPrimitive = (value) =>
    isNil(value) || isNumber(value) || isString(value) || isBoolean(value);

/**
 * Renders a webcomponent by name
 *
 * Much of the complexity of this component comes from:
 * 1. Splitting primitive and non primitive properties
 * 2. Setting and updating events
 *
 * We need to split primitive and non primitive values because React will not properly
 * render non primitive values on the web component. So we have to set non primitive values manually
 *
 * We need to set events manually because React does not properly subscribe to events on web components
 *
 * We need to update events correctly because we want to avoid duplicate event listeners. With checking for changing
 * event listener functions, event listeners are either never updated for the lifetime of the component, or
 * new event listeners are added event cycle causing a continuous increase in event listeners.
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

    /**
     * Given a key a value set the value of property named `key` to
     * the value of `value`
     *
     * @param {string} key The name of the property
     * @param {any} value The value of the property
     *
     * @returns {void}
     */
    setComponentProperty(key: string, value: any): void {
        const element = this.component.current;
        element[key] = value;
    }

    /**
     * Get the handler for an event.
     *
     * Events must be bound using this function otherwise events will bubble up too far
     * since react events are different that native dom events
     *
     * @param {string} eventName the name of the event to get the handler for
     *
     * @returns {any} the handler to bind to the component for the event name
     */
    getHandler(eventName: string) {
        const { events } = this.props;

        return (event) => {
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
     * Get the events to remove from the component
     *
     * @param {object} prevEvents previous events
     * @param {object} nextEvents new events
     *
     * @returns {object} the events to remove
     */
    getEventsToRemove(prevEvents: object, nextEvents: object): object {
        return pickBy(
            prevEvents,
            (value, key) => !has(nextEvents, key) || nextEvents[key] !== value
        );
    }

    /**
     * Get the events to add to the component
     *
     * @param {object} prevEvents previous events
     * @param {object} nextEvents new events
     *
     * @returns {object} the events to add
     */
    getEventsToAdd(prevEvents: object, nextEvents: object): object {
        return pickBy(
            nextEvents,
            (value, key) => !has(prevEvents, key) || prevEvents[key] !== value
        );
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

        // isEqual does a deep equal but since events is just an object of string keys to
        // function values it won't be very expensive especially because isEqual
        // compares functions with ===. But we want to check equality of the functions
        // not the wrapping object to avoid excessive rerenders.
        if (isEqual(prevEvents, events)) {
            return;
        }

        this.setState({ prevEvents: events });

        const eventsToAdd = this.getEventsToAdd(prevEvents, events);
        const eventsToRemove = this.getEventsToRemove(prevEvents, events);

        if (!isEmpty(eventsToRemove)) {
            this.removeEvents(eventsToRemove);
        }

        if (!isEmpty(eventsToAdd)) {
            this.setEvents(eventsToAdd);
        }
    }

    /**
     * Get non primitive props. i.e. object, function, array, etc
     *
     * @param {object} elementProps the props to pass the webcomponet
     *
     * @returns {object} non primitive props
     */
    getNonPrimitiveProps(elementProps: object) {
        return pickBy(elementProps, negate(isPrimitive));
    }

    /**
     * Get primitive props. i.e. integer, boolean, etc
     *
     * @param {object} elementProps the props to pass the webcomponet
     *
     * @returns {object} primitive props
     */
    getPrimitiveProps(elementProps: object): object {
        return pickBy(elementProps, isPrimitive);
    }

    /**
     * Given the previous renders props and the next renders props,
     * check if any of the property values have changed and return an
     * object with only those values
     *
     * @param {object} prevNonPrimitiveProps the previous renders non primitive props
     * @param {object} nextNonPrimitiveProps the current renders non primitive props
     *
     * @returns {object} the changed primitive props
     */
    getChangedNonPrimitiveProps(
        prevNonPrimitiveProps: object,
        nextNonPrimitiveProps: object
    ): object {
        return pickBy(
            nextNonPrimitiveProps,
            (value, key) => prevNonPrimitiveProps[key] !== value
        );
    }

    /**
     * Set non primitive props on the web component.
     *
     * We have to set non primitive props via the setComponentProperty
     * instead of passing them as props the the React.createElement
     * function because non primitive props are not passed properly to the web
     * component via React.createElement
     *
     * @param {object} elementProps element props to set
     *
     * @returns {void}
     */
    setNonPrimitives(elementProps: object): void {
        toPairs(elementProps).forEach(([key, value]) =>
            this.setComponentProperty(key, value)
        );
    }

    componentDidMount() {
        const { elementProps } = this.props;

        this.setNonPrimitives(this.getNonPrimitiveProps(elementProps));

        this.updateEvents();
    }

    componentWillUnmount() {
        this.removeEvents(this.state.prevEvents);
    }

    componentDidUpdate(prevProps) {
        const { elementProps: nextElementProps } = this.props;
        const { elementProps: prevElementProps } = prevProps;

        this.setNonPrimitives(
            this.getChangedNonPrimitiveProps(prevElementProps, nextElementProps)
        );

        this.updateEvents();
    }

    render() {
        const { name, elementProps } = this.props;

        let primitiveProps = this.getPrimitiveProps(elementProps);

        // Map all keys to kebabcase for react because react doesn't properly map
        // camelCase to kebab-case when setting properties on web-components
        primitiveProps = mapKeys(primitiveProps, (_, key) => kebabCase(key));

        return React.createElement(name, {
            ...primitiveProps,
            ref: this.component,
        });
    }
}
