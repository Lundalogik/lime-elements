import { JsonDocsComponent, JsonDocsProp } from '@stencil/core/internal';
import { InterfaceDescription, TypeDescription } from '../types';
import { isExample } from './menu';
import negate from 'lodash/negate';
import startCase from 'lodash/startCase';
import zipObject from 'lodash/zipObject';
import pick from 'lodash/pick';

const ARRAY_PATTERN = /^(\w+)(<\w+>)?\[\]$|^Array<(\w+)(<\w+>)?>$/;
const ENUM_PATTERN = /["'](\w+)["']\s?\|?/g;
const ID_PATTERN = /^number \| string$|string \| number$/g;

/**
 * Create schemas for the components that describe their interface
 *
 * @param {JsonDocsComponent[]} components the components
 * @param {TypeDescription[]} types type definitions
 *
 * @returns {*} list of schemas for the components
 */
export function createSchemas(
    components: JsonDocsComponent[],
    types: TypeDescription[]
): Array<Record<string, any>> {
    return components?.filter(negate(isExample)).map(createSchema(types));
}

const createSchema = (types: TypeDescription[]) => (
    component: JsonDocsComponent
) => {
    const definitions = createDefinitions(types);
    const properties = createProps(component.props, definitions);

    const schema: any = {
        type: 'object',
        $id: component.tag,
        properties: properties,
    };

    const data = JSON.stringify(properties);
    const definitionKeys = Object.keys(definitions).filter(
        isReferenceUsed(data)
    );

    if (definitionKeys.length > 0) {
        schema.definitions = pick(definitions, definitionKeys);
    }

    return schema;
};

function createDefinitions(types: TypeDescription[]): Record<string, any> {
    const interfaces: InterfaceDescription[] = types.filter(
        (type) => type.type === 'interface'
    ) as any;
    const keys = interfaces.map((i) => i.name);
    const schemas = interfaces.map((i) => {
        return {
            type: 'object',
            properties: createProps(i.props as JsonDocsProp[], {}),
        };
    });

    return zipObject(keys, schemas);
}

function createProps(props: JsonDocsProp[], definitions: Record<string, any>) {
    const keys = props.map((prop) => prop.name);
    const schemas = props.map(createPropSchema(definitions));

    return zipObject(keys, schemas);
}

const createPropSchema = (definitions: Record<string, any>) => (
    prop: JsonDocsProp
) => {
    const schema: any = {
        type: getSchemaType(prop.type),
        title: startCase(prop.name),
    };

    if (prop.default) {
        schema.default = getDefaultValue(prop.default, schema.type);
    }

    if (schema.type === 'array') {
        schema.items = getSchemaItems(prop.type, definitions);
    }

    if (schema.type === 'object') {
        const ref = getSchemaPropertiesRef(prop.type, definitions);

        if (ref) {
            schema.$ref = ref;
        } else {
            schema.additionalProperties = true;
        }
    }

    if (schema.type === 'string') {
        const oneOf = getOneOf(prop.type);

        if (oneOf) {
            schema.oneOf = oneOf;
        }
    }

    return schema;
};

function getDefaultValue(value: any, type: string) {
    if (type === 'boolean') {
        return value === 'true';
    }

    if (type === 'number') {
        return Number(value);
    }

    if (type !== 'string') {
        return;
    }

    if (value === 'null') {
        return;
    }

    return value;
}

function getSchemaType(propType: string) {
    if (['string', 'number', 'boolean'].includes(propType)) {
        return propType;
    }

    if (propType.match(ARRAY_PATTERN)) {
        return 'array';
    }

    if (propType.match(ENUM_PATTERN) || propType.match(ID_PATTERN)) {
        return 'string';
    }

    return 'object';
}

function getSchemaItems(propType: string, definitions: Record<string, any>) {
    const result = propType.match(ARRAY_PATTERN);
    const type = getSchemaType(result[1] || result[3]);

    const items: any = {
        type: type,
    };

    if (type === 'object') {
        const ref = getSchemaPropertiesRef(result[1] || result[3], definitions);

        if (ref) {
            items.$ref = ref;
        } else {
            items.additionalProperties = true;
        }
    }

    return items;
}

function getSchemaPropertiesRef(
    propType: string,
    definitions: Record<string, any>
): string {
    const definition = Object.keys(definitions).find((key) => key === propType);
    if (!definition) {
        return;
    }

    return '#/definitions/' + definition;
}

function getOneOf(propType: string) {
    const matches = [...propType.matchAll(ENUM_PATTERN)];
    const oneOf = matches.map((match) => {
        return {
            type: 'string',
            const: match[1],
            title: match[1],
        };
    });

    if (!oneOf.length) {
        return;
    }

    return oneOf;
}

const isReferenceUsed = (data: string) => (name: string) => {
    const ref = '#/definitions/' + name;

    return data.includes(ref);
};
