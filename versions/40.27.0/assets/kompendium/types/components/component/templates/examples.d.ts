import { JsonDocsComponent, JsonDocsTag } from '../../../stencil-public-runtime';
import { PropsFactory } from '../../playground/playground.types';
export declare function ExampleList({ examples, slugs, id, slugId, schema, propsFactory, }: {
    id?: string;
    slugId?: string;
    examples: JsonDocsComponent[];
    slugs: string[];
    schema: Record<string, any>;
    propsFactory?: PropsFactory;
}): HTMLElement[];
export declare const isExampleTag: (name: string) => (tag: JsonDocsTag) => boolean;
