import { WidgetProps as RjsfWidgetProps } from '@rjsf/core';
import { LimeJSONSchema } from '../internal.types';

export interface WidgetProps extends RjsfWidgetProps {
    onLimelChange: (value: any) => void;
    schema: LimeJSONSchema;
}
