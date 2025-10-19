import { TypeDescription } from '../../types';
import { MatchResults } from '../router/router-utils';
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
