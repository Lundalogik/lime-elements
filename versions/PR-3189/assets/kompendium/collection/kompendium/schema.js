import { isExample } from './menu';
import negate from 'lodash/negate';
import startCase from 'lodash/startCase';
import zipObject from 'lodash/zipObject';
import pick from 'lodash/pick';
const ARRAY_PATTERN = /^(\w+)(<\w+>)?\[\]$|^Array<(.+)>$/;
const ENUM_PATTERN = /["'](\w+)["']\s?\|?/g;
const ID_PATTERN = /^number \| string$|string \| number$/g;
const TS_UTILITY_PATTERN = /(Partial|Required|Readonly|Array)<(.+?)>/g;
/**
 * Create schemas for the components that describe their interface
 * @param {JsonDocsComponent[]} components the components
 * @param {TypeDescription[]} types type definitions
 * @returns {*} list of schemas for the components
 */
export function createSchemas(components, types) {
  var _a;
  const componentSchemas = (components === null || components === void 0 ? void 0 : components.filter(negate(isExample)).map(createSchema(types))) || [];
  const classSchemas = ((_a = types === null || types === void 0 ? void 0 : types.filter(isClass)) === null || _a === void 0 ? void 0 : _a.map(createSchema(types))) || [];
  return [...componentSchemas, ...classSchemas];
}
const createSchema = (types) => (object) => {
  const definitions = createDefinitions(types);
  const properties = createProps(object.props, definitions);
  const schema = {
    type: 'object',
    $id: getSchemaId(object),
    properties: properties,
  };
  const data = JSON.stringify(properties);
  const definitionKeys = Object.keys(definitions).filter(isReferenceUsed(data));
  if (definitionKeys.length > 0) {
    schema.definitions = pick(definitions, definitionKeys);
  }
  return schema;
};
function getSchemaId(object) {
  if (isClass(object)) {
    return object.name;
  }
  return object.tag;
}
function createDefinitions(types) {
  const interfaces = types.filter((type) => type.type === 'interface');
  const keys = interfaces.map((i) => i.name);
  const schemas = interfaces.map((i) => {
    return {
      type: 'object',
      properties: createProps(i.props, {}),
    };
  });
  return zipObject(keys, schemas);
}
function createProps(props, definitions) {
  const keys = (props === null || props === void 0 ? void 0 : props.map((prop) => prop.name)) || [];
  const schemas = (props === null || props === void 0 ? void 0 : props.map(createPropSchema(definitions))) || [];
  return zipObject(keys, schemas);
}
const createPropSchema = (definitions) => (prop) => {
  const schema = {
    type: getSchemaType(prop.type),
    title: startCase(prop.name),
    description: prop.docs,
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
    }
    else {
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
function getDefaultValue(value, type) {
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
function getSchemaType(propType) {
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
function getSchemaItems(propType, definitions) {
  const result = propType.match(ARRAY_PATTERN);
  const type = getSchemaType(result[1] || result[3]);
  const items = {
    type: type,
  };
  if (type === 'object') {
    const ref = getSchemaPropertiesRef(result[1] || result[3], definitions);
    if (ref) {
      items.$ref = ref;
    }
    else {
      items.additionalProperties = true;
    }
  }
  return items;
}
function getSchemaPropertiesRef(propType, definitions) {
  const definition = Object.keys(definitions).find((key) => key === propType);
  if (definition) {
    return '#/definitions/' + definition;
  }
  const type = propType.replace(TS_UTILITY_PATTERN, '$2');
  if (type === propType) {
    return;
  }
  return getSchemaPropertiesRef(type, definitions);
}
function getOneOf(propType) {
  if (!ENUM_PATTERN.test(propType)) {
    return;
  }
  const oneOf = propType.split('|').map((token) => {
    const value = token.trim().replace(/["']/g, '');
    return {
      type: 'string',
      const: value,
      title: value,
    };
  });
  if (!oneOf.length) {
    return;
  }
  return oneOf;
}
const isReferenceUsed = (data) => (name) => {
  const ref = '#/definitions/' + name;
  return data.includes(ref);
};
function isClass(type) {
  return type.type === 'class';
}
