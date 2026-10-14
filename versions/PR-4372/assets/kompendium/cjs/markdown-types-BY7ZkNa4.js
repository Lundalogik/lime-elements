'use strict';

let types = [];
let components = [];
function getTypes() {
    return types;
}
function setTypes(newTypes) {
    types = newTypes;
}
function getComponents() {
    return components;
}
function setComponents(newComponents) {
    components = newComponents;
}

exports.getComponents = getComponents;
exports.getTypes = getTypes;
exports.setComponents = setComponents;
exports.setTypes = setTypes;
