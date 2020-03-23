import React, { useEffect, useRef } from 'react';
import { isNil, isNumber, isString, isBoolean } from 'lodash-es';

// Keeps track of previous value
const usePrevious = <T = any>(value: T): T | undefined => {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

// Checks if value is a primitive
const isPrimitive = value =>
    isNil(value) || isNumber(value) || isString(value) || isBoolean(value);

export const LimeElementsAdapter = ({
    name,
    events = {},
    elementProps = {},
}: {
    name: string;
    events?: any;
    elementProps?: any;
}) => {
    const component = useRef(null);
    const prevElementProps = usePrevious(elementProps);

    const setComponentProperty = ([key, value]: [string, any]) => {
        const element = component.current;
        element[key] = value;
    };

    const getHandler = eventName => {
        return event => {
            console.log('[EVENT] Stoppping propagation', event);
            event.stopPropagation();
            events[eventName](event);
        };
    };

    const setEvents = () => {
        const element = component.current;
        for (const event of Object.keys(events)) {
            element.addEventListener(event, getHandler(event));
        }
    };

    const removeEvents = () => {
        const element = component.current;
        for (const event of Object.keys(events)) {
            element.removeEventListener(event, events[event]);
        }
    };

    const getNonPrimitiveProps = () => {
        const nonPrimitiveProps = {};
        for (const propName of Object.keys(elementProps)) {
            if (!isPrimitive(elementProps[propName])) {
                nonPrimitiveProps[propName] = elementProps[propName];
            }
        }

        return nonPrimitiveProps;
    };

    const getPrimitiveProps = () => {
        const primitiveProps = {};
        for (const propName of Object.keys(elementProps)) {
            if (isPrimitive(elementProps[propName])) {
                primitiveProps[propName] = elementProps[propName];
            }
        }

        return primitiveProps;
    };

    const setNonPrimitives = () => {
        const nonPrimitiveProps = getNonPrimitiveProps();
        Object.entries(nonPrimitiveProps)
            .filter(([key, value]) => {
                // If no previous props, set all properties
                if (!prevElementProps) {
                    return true;
                }

                // otherwise check if prop has changed
                return prevElementProps[key] !== value;
            })
            .forEach(setComponentProperty);
    };

    // Set events on mount and remove events on unmount
    useEffect(() => {
        setEvents();

        return () => {
            removeEvents();
        };
    }, []);

    // Update non primitives on mount and when component is updated
    useEffect(() => {
        setNonPrimitives();
    }, [elementProps]);

    return React.createElement(name, {
        ...getPrimitiveProps(),
        ref: component,
    });
};
