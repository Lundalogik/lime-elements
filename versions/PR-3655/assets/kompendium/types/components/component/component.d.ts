import { JsonDocs } from '../../stencil-public-runtime';
import { MatchResults } from '../router/route-matching';
import { PropsFactory } from '../playground/playground.types';
export declare class KompendiumComponent {
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
     */
    examplePropsFactory: PropsFactory;
    private host;
    private scrollToOnNextUpdate;
    constructor();
    protected connectedCallback(): void;
    protected disconnectedCallback(): void;
    protected componentDidLoad(): void;
    protected componentDidUpdate(): void;
    private handleRouteChange;
    private scrollToElement;
    render(): HTMLElement;
    private renderDocs;
    private getId;
    private getRoute;
}
