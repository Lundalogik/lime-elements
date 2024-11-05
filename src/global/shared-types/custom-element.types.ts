/**
 * Custom Element definition
 *
 * Used to define a Custom Element
 *
 * @alpha
 */
export interface CustomElementDefinition {
    tagName: string;
    attributes: string[];
}

/**
 * Custom Element
 *
 * @alpha
 */
export type CustomElement = Omit<CustomElementDefinition, 'attributes'> & {
    /**
     * Record of attributes and values to apply to the node
     */
    attributes: Record<string, any>;
};
