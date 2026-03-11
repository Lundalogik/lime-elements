import { TypeDescription } from '../../types';
import { MatchResults } from '@limetech/stencil-router';
export declare class Type {
    /**
     */
    types: TypeDescription[];
    /**
     * Matched route parameters
     */
    match: MatchResults;
    private type;
    componentWillRender(): void;
    render(): HTMLElement;
    private findType;
}
