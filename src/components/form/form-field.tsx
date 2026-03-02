import { FunctionalComponent, h } from '@stencil/core';
import {
    GridLayoutOptions,
    LimeLayoutOptions,
    LimeSchemaOptions,
} from './form.types';

type FormFieldProps = Omit<LimeSchemaOptions, 'layout'> & {
    name: string;
    layout?: Partial<LimeLayoutOptions>;
};

export const FormField: FunctionalComponent<FormFieldProps> = (
    props,
    children
) => {
    if (children.length === 0) {
        return (
            <div
                class="form-group field"
                data-lime={JSON.stringify(props)}
            ></div>
        );
    }

    const layout = props.layout as GridLayoutOptions;

    let classNames = 'form-group field field-custom';

    if (layout?.colSpan) {
        classNames += ` limel-form-layout-colspan--${layout.colSpan}`;
    }

    const style = getGridStyle(layout);

    return (
        <div
            class={classNames}
            slot={props.name}
            style={style}
            data-lime={JSON.stringify(props)}
        >
            {children}
        </div>
    );
};

function getGridStyle(layout: GridLayoutOptions | undefined) {
    const rowSpan = layout?.rowSpan;
    if (rowSpan) {
        return {
            'grid-row': `span ${rowSpan}`,
            'min-height': `calc(var(--min-height-of-one-row) * ${rowSpan})`,
        };
    }
}
