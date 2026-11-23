
<!-- Auto Generated Below -->


## Overview

This component can be used on places such as a start page or a dashboard.
It offers features for visualizing aggregated data along with supplementary
information.

If clicking on the component should navigate the user to
a new screen or web page, you need to provide a URL,
using the `link` property.

## Properties

| Property          | Attribute          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Type               | Default     |
| ----------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------- |
| `badge`           | `badge`            | If supplied, the info tile will display a notification badge.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `number \| string` | `undefined` |
| `clickable`       | `clickable`        | Set to `true` if the tile should act on a click, but has no URL to navigate to. For instance, when a click opens a dialog. Listen for the `click` event on the tile itself.  The tile then gets the same interactive styling as a tile with a `link`: a resting shadow, `cursor: pointer`, and on hover the elevation, the tilt that follows the cursor, and the glow. It can also be reached with the keyboard, where it is announced as a button, and pressing `Enter` or `Space` clicks it.  Has no effect when a `link` is supplied, since the tile then is a link. Prefer a `link` whenever there is somewhere to go. | `boolean`          | `false`     |
| `disabled`        | `disabled`         | Set to `true` if info tile is disabled.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `boolean`          | `false`     |
| `icon`            | `icon`             | Name of icon for the info tile.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `string`           | `undefined` |
| `label`           | `label`            | The text to show below the info tile. Long labels will be truncated.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `string`           | `null`      |
| `link`            | --                 | If supplied, the info tile will be a clickable link.  Supplying a value also adds an elevated effect using a shadow, as well as `cursor: pointer`, which appears on hover. If the tile should act on a click but there is no URL to go to, set `clickable` instead.                                                                                                                                                                                                                                                                                                                                                        | `Link`             | `undefined` |
| `loading`         | `loading`          | Set to `true` to put the component in the `loading` state. This does _not_ disable the link. To do so, the `disabled` property should be set to `true` as well.                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `boolean`          | `false`     |
| `prefix`          | `prefix`           | A string of text that is visually placed before the value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `string`           | `undefined` |
| `progress`        | --                 | Properties of the optional circular progress bar.  Defaults: - `maxValue`: 100 - `suffix`: % - `displayPercentageColors`: false  Colors change with intervals of 10 %.                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `InfoTileProgress` | `undefined` |
| `reducedPresence` | `reduced-presence` | Set to `true` to render the tile with a reduced visual presence — lower saturation and opacity, so the tile draws less attention.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `boolean`          | `false`     |
| `suffix`          | `suffix`           | A string of text that is visually placed after the value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `string`           | `undefined` |
| `value`           | `value`            | A piece of text or number that is the main piece of information which the component is intended to visualize.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `number \| string` | `undefined` |


## Dependencies

### Used by

 - [limel-example-info-tile-badge](examples)
 - [limel-example-info-tile-basic](examples)
 - [limel-example-info-tile-clickable](examples)
 - [limel-example-info-tile-link](examples)
 - [limel-example-info-tile-loading](examples)
 - [limel-example-info-tile-primary-slot](examples)
 - [limel-example-info-tile-progress](examples)
 - [limel-example-info-tile-reduced-presence](examples)
 - [limel-example-info-tile-styling](examples)

### Depends on

- [limel-icon](../icon)
- [limel-circular-progress](../circular-progress)
- [limel-badge](../badge)
- [limel-linear-progress](../linear-progress)
- [limel-3d-hover-effect-glow](../3d-hover-effect-glow)

### Graph
```mermaid
graph TD;
  limel-info-tile --> limel-icon
  limel-info-tile --> limel-circular-progress
  limel-info-tile --> limel-badge
  limel-info-tile --> limel-linear-progress
  limel-info-tile --> limel-3d-hover-effect-glow
  limel-example-info-tile-badge --> limel-info-tile
  limel-example-info-tile-basic --> limel-info-tile
  limel-example-info-tile-clickable --> limel-info-tile
  limel-example-info-tile-link --> limel-info-tile
  limel-example-info-tile-loading --> limel-info-tile
  limel-example-info-tile-primary-slot --> limel-info-tile
  limel-example-info-tile-progress --> limel-info-tile
  limel-example-info-tile-reduced-presence --> limel-info-tile
  limel-example-info-tile-styling --> limel-info-tile
  style limel-info-tile fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
