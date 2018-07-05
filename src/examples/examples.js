export const examples = [{
    name: 'limel-button',
    title: 'Button'
},{
    name: 'limel-switch',
    title: 'Switch'
},{
    name: 'limel-select',
    title: 'Select'
},{
    name: 'limel-text-field',
    title: 'Text Field'
},{
    name: 'limel-dialog',
    title: 'Dialog'
}].sort((a, b) => {
    return a.title > b.title ? 1 : -1;
});
