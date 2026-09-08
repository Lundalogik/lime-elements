import { JsonDocs, JsonDocsComponent } from '../stencil-public-runtime';
export interface JsonDocsSource {
    filename: string;
    type: 'tsx' | 'ts' | 'scss' | 'less' | 'css';
    source: string;
}
export declare function addSources(docs: JsonDocs): Promise<JsonDocs>;
export declare function addComponentSources(component: JsonDocsComponent): Promise<any>;
export declare function getSources(component: JsonDocsComponent): Promise<JsonDocsSource[]>;
export declare function getStyleFiles(source: string): string[];
