import { JsonDocsComponent, JsonDocsTag } from '../../../stencil-public-runtime';
import { PropsFactory } from '../../playground/playground.types';
export declare function ExampleList({ examples, id, schema, propsFactory, }: {
    id: string;
    examples: JsonDocsComponent[];
    schema: Record<string, any>;
    propsFactory?: PropsFactory;
}): HTMLElement[];
export declare const isExampleTag: (name: string) => (tag: JsonDocsTag) => boolean;
