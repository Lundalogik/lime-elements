import { Action } from '../../collapsible-section/action';
import React, { PropsWithChildren, ReactNode } from 'react';
import { findTitle, hasNestedErrors } from './common';
import {
    ArrayFieldItemButtonsTemplateProps,
    ErrorSchema,
    getDefaultFormState,
} from '@rjsf/utils';
import { Runnable } from './types';
import { isEmpty, isEqual } from 'lodash-es';
import { rjsfValidator } from '../validator';
import { FormSchema } from '../form.types';
import { JSONSchema7 } from 'json-schema';

export interface CollapsibleItemProps {
    buttonsProps: ArrayFieldItemButtonsTemplateProps;

    /**
     * The index of the field in the array
     */
    index: number;

    /**
     * The value of the field
     */
    data: any;

    /**
     * Schema for the field
     */
    schema: JSONSchema7;

    /**
     * Schema for the entire form
     */
    formSchema: JSONSchema7;

    /**
     * Control whether items can be removed.
     */
    allowItemRemoval: boolean;

    /**
     * Whether this particular item can be reordered.
     */
    allowItemReorder: boolean;

    /**
     * Validation errors for this item, as an RJSF `errorSchema` subtree.
     * Used to flag the item's header when it contains invalid fields,
     * even while the item is collapsed and its fields are not rendered.
     */
    errorSchema?: ErrorSchema;

    /**
     * Whether the form has been asked to reveal all validation errors
     * (typically on a save attempt). The header only reflects nested
     * errors when this is `true`, keeping a freshly loaded form silent.
     */
    revealErrors?: boolean;
}

export class CollapsibleItemTemplate extends React.Component<
    PropsWithChildren<CollapsibleItemProps>
> {
    state = {
        isOpen: false,
    };

    constructor(public props: PropsWithChildren<CollapsibleItemProps>) {
        super(props);
        this.handleAction = this.handleAction.bind(this);

        this.state = {
            isOpen: isNewItem(props),
        };
    }

    private section: HTMLLimelCollapsibleSectionElement;

    public componentDidMount() {
        const section = this.section;
        section.addEventListener('action', this.handleAction);
        section.addEventListener('open', this.handleOpen);

        this.setActions(section);
    }

    public componentDidUpdate() {
        this.setActions(this.section);
    }

    public componentWillUnmount() {
        const section = this.section;
        section.removeEventListener('action', this.handleAction);
        section.removeEventListener('open', this.handleOpen);
    }

    public render() {
        const { data, schema, formSchema, errorSchema, revealErrors } =
            this.props;
        let children: ReactNode;
        if (this.state.isOpen) {
            children = this.props.children;
        }

        const dragHandle = this.props.allowItemReorder
            ? React.createElement('limel-drag-handle', {
                  slot: 'header',
                  class: 'drag-handle',
              })
            : null;

        const invalid = revealErrors === true && hasNestedErrors(errorSchema);

        return React.createElement(
            'limel-collapsible-section',
            {
                header: findTitle(data, schema, formSchema) || 'New item',
                class: 'array-item limel-form-array-item--object',
                ref: (section: HTMLLimelCollapsibleSectionElement) => {
                    this.section = section;
                },
                'is-open': this.state.isOpen,
                'data-reorder-id': String(this.props.index),
                'data-reorderable': this.props.allowItemReorder
                    ? 'true'
                    : 'false',
                invalid: invalid,
            },
            dragHandle,
            children
        );
    }

    private setActions(element: HTMLLimelCollapsibleSectionElement) {
        const { buttonsProps, allowItemRemoval } = this.props;
        const actions: Array<Action & Runnable> = [];

        if (allowItemRemoval) {
            actions.push({
                id: 'remove',
                icon: 'trash',
                disabled: !buttonsProps.hasRemove,
                run: buttonsProps.onRemoveItem,
            });
        }

        element.actions = actions;
    }

    private handleAction(event: CustomEvent<Action & Runnable>) {
        event.stopPropagation();
        event.detail.run(event);
    }

    private handleOpen = () => {
        this.setState({
            isOpen: true,
        });
    };
}

/**
 * An item counts as new while it holds nothing the user entered. Since
 * `@rjsf/core` 6.10 fills a required property with its default as soon as the
 * item exists, "nothing entered" means empty data *or* data equal to what the
 * schema produces on its own.
 *
 * @param props - the props of the item being rendered
 */
function isNewItem(props: CollapsibleItemProps): boolean {
    if (isDeepEmpty(props.data)) {
        return true;
    }

    return isEqual(props.data, getItemDefaults(props));
}

function getItemDefaults(props: CollapsibleItemProps): unknown {
    const items = (props.schema as FormSchema)?.items;
    const itemSchema = (
        Array.isArray(items) ? items[props.index] : items
    ) as FormSchema;

    if (!itemSchema) {
        return;
    }

    // Must match the `experimental_defaultFormStateBehavior` that `limel-form`
    // passes to `@rjsf/core`. Computing defaults under different options gives
    // data the form never writes, and the comparison above then fails.
    return getDefaultFormState(
        rjsfValidator,
        itemSchema,
        undefined,
        (props.formSchema ?? itemSchema) as FormSchema,
        false,
        { constAsDefaults: 'skipOneOf', requiredBooleanDefault: 'skip' }
    );
}

function isDeepEmpty(data: unknown): boolean {
    if (typeof data !== 'object') {
        return false;
    }

    if (isEmpty(data)) {
        return true;
    }

    return Object.values(data).every(isDeepEmpty);
}
