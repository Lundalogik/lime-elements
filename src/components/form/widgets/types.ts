import { WidgetProps as RjsfWidgetProps } from '@rjsf/utils';
import { FormSchema } from '../form.types';

export interface WidgetProps extends RjsfWidgetProps {
    schema: FormSchema;
}
