
<!-- Auto Generated Below -->


## Overview

Customizing the visualization of the `readonly` state
It is possible and recommended that you enhance the visualization of a `boolean` field
in a `readonly` state.

Because depending on the context, the default UI of the `readonly` state may not always
provide the best way of _visualizing information_, potentially leading to
confusion and negatively affecting the end-users' experience.

:::important
Before reading the documentations below, make sure to read
1. our guides about the difference between
[Disabled vs. Readonly](#/DesignGuidelines/disabled-vs-readonly.md/) in our components.
2. our guidelines about [Labeling boolean fields](#/DesignGuidelines/labeling-boolean-fields.md/).
:::

Using the `readonlyLabels` optional prop, you can override the `label` and
customize it accordingly. Additionally, by using the `icon` prop, you can
override the default icons and their colors.

## Dependencies

### Depends on

- [limel-checkbox](..)
- [limel-example-controls](../../../examples)
- [limel-switch](../../switch)
- [limel-example-value](../../../examples)

### Graph
```mermaid
graph TD;
  limel-example-checkbox-readonly --> limel-checkbox
  limel-example-checkbox-readonly --> limel-example-controls
  limel-example-checkbox-readonly --> limel-switch
  limel-example-checkbox-readonly --> limel-example-value
  limel-checkbox --> limel-dynamic-label
  limel-checkbox --> limel-helper-line
  limel-dynamic-label --> limel-icon
  limel-switch --> limel-helper-line
  limel-switch --> limel-dynamic-label
  style limel-example-checkbox-readonly fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
