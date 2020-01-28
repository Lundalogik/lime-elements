export function isObjectType(schema: any = {}) {
    return isType(schema.type, 'object');
}

export function isArrayType(schema: any) {
    return isType(schema.type, 'array');
}

export function isStringType(schema: any) {
    return isType(schema.type, 'string');
}

export function isNumberType(schema: any) {
    return isType(schema.type, 'number');
}

export function isIntegerType(schema: any) {
    return isType(schema.type, 'integer');
}

function isType(input: string | string[], type: string) {
    if (Array.isArray(input)) {
        return input.includes(type);
    }

    return input === type;
}
