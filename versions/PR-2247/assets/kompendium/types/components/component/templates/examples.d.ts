import { JsonDocsComponent, JsonDocsTag } from '../../../stencil-public-runtime';
export declare function ExampleList({ examples, id, schema, }: {
  id: string;
  examples: JsonDocsComponent[];
  schema: Record<string, any>;
}): HTMLElement[];
export declare const isExampleTag: (name: string) => (tag: JsonDocsTag) => boolean;
