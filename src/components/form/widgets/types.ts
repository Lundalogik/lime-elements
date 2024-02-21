import { WidgetProps as RjsfWidgetProps } from '@rjsf/core';
import { FormSchema } from '../form.types';

export interface WidgetProps extends RjsfWidgetProps {
    schema: FormSchema;
}
