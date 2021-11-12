import { JsonDocsComponent, JsonDocsTag } from '../../../stencil-public-runtime';
export declare function ExampleList({ examples, id, }: {
    id: string;
    examples: JsonDocsComponent[];
}): HTMLElement[];
export declare const isExampleTag: (name: string) => (tag: JsonDocsTag) => boolean;
