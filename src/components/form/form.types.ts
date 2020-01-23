export interface ValidationStatus {
    /**
     * True if the form is valid, false otherwise
     *
     * If the form is invalid, any errors can be found on the `errors` property
     */
    valid: boolean;

    /**
     * List of validation errors
     */
    errors?: FormError[];
}

export interface FormError {
    /**
     * Name of the error
     */
    name: string;

    /**
     * Name of the invalid property
     */
    property: string;

    /**
     * Path to the property within the schema
     */
    schemaPath: string;

    /**
     * String describing the error
     */
    message: string;
}
