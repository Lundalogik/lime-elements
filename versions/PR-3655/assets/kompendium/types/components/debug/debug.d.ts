import { JsonDocs } from '../../stencil-public-runtime';
import { MatchResults } from '../router/route-matching';
import { PropsFactory } from '../playground/playground.types';
export declare class KompendiumDebug {
    /**
     * The generated documentation data
     */
    docs: JsonDocs;
    /**
     * Component schemas
     */
    schemas: Array<Record<string, any>>;
    /**
     * Matched route parameters
     */
    match: MatchResults;
    /**
     * Factory for creating props for example components
     * @returns {Record<string, unknown>} props
     */
    examplePropsFactory?: PropsFactory;
    render(): HTMLElement;
    private renderComponent;
}
