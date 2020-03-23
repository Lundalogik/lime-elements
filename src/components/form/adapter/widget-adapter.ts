import React, {
    useState,
    useCallback,
    useMemo,
    useEffect,
    useRef,
} from 'react';
import { WidgetProps } from '../widgets/types';
import { LimeElementsAdapter } from './base-adapter';

function capitalize(text: string = '') {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export const LimeElementsWidgetAdapter = ({
    name,
    value,
    widgetProps,
    extraProps = {},
    events = {},
}: {
    name: string;
    value?: any;
    widgetProps: WidgetProps;
    extraProps?: any;
    events?: { [key: string]: (event: any) => void };
}) => {
    const {
        schema,
        rawErrors,
        label,
        required,
        disabled,
        onChange,
        value: widgetValue,
    } = widgetProps;

    // Use widgetValue unless its overriden in widget
    value = value || widgetValue;

    const hasValue = () => {
        if (!value) {
            return false;
        }

        if (Array.isArray(value)) {
            return !!value.length;
        }

        if (typeof value === 'object') {
            return !!Object.entries(value).length;
        }

        return true;
    };

    const [modified, setModified] = useState(hasValue());

    const handleBlur = useCallback(() => setModified(true), []);

    events = useMemo(
        () => ({ change: onChange, blur: handleBlur, ...events }),
        [onChange, handleBlur, events]
    );

    const getLabel = () => {
        return label || schema.title;
    };

    const isInvalid = () => {
        if (!modified) {
            return false;
        }

        return !!rawErrors;
    };

    const isRequired = () => {
        return required || schema.minItems > 0;
    };

    const getHelperText = () => {
        if (!isInvalid()) {
            return schema.description;
        }

        if (rawErrors) {
            return capitalize(rawErrors[0]);
        }

        return schema.description;
    };

    return React.createElement(LimeElementsAdapter, {
        name: name,
        elementProps: {
            value: value,
            label: getLabel(),
            disabled: disabled,
            required: isRequired(),
            invalid: isInvalid(),
            'helper-text': getHelperText(),
            widgetProps: widgetProps,
            ...extraProps,
        },
        events: events,
    });
};
