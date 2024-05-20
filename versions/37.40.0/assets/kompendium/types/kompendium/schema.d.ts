import { JsonDocsComponent } from '../stencil-public-runtime';
import { TypeDescription } from '../types';
/**
 * Create schemas for the components that describe their interface
 *
 * @param {JsonDocsComponent[]} components the components
 * @param {TypeDescription[]} types type definitions
 * @returns {*} list of schemas for the components
 */
export declare function createSchemas(components: JsonDocsComponent[], types: TypeDescription[]): Array<Record<string, any>>;
