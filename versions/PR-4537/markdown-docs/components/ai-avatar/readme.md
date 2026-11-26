
<!-- Auto Generated Below -->


## Overview

This component displays an avatar, representing Lime AI assistants.

:::warning
This is a private component used internally in Lime's various applications,
which is the reason for having it in Lime Elements —to ease the distribution
of the component across all our apps.

3rd party developers are not allowed use this component directly.
:::

## Properties

| Property     | Attribute     | Description                                                                                                                                                                                                                                                                                                                                                                                                                               | Type                                                                     | Default                                      |
| ------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------- |
| `isThinking` | `is-thinking` | <span style="color:red">**[DEPRECATED]**</span> Use the `mode` property with the value `thinking` instead. This property will be removed in a future major version.  Until removal, setting this to `true` is bridged to `mode="thinking"` when `mode` is at its default (`idle`); an explicit `mode` value always wins, so consumers can migrate by replacing `isThinking={true}` with `mode="thinking"` without coordination.<br/><br/> | `boolean`                                                                | `false`                                      |
| `language`   | `language`    | Defines the language for translations.                                                                                                                                                                                                                                                                                                                                                                                                    | `"da" \| "de" \| "en" \| "fi" \| "fr" \| "nb" \| "nl" \| "no" \| "sv"`   | `document.documentElement.lang as Languages` |
| `mode`       | `mode`        | Represents the current activity of the AI agent. The avatar uses this to drive its visual state and animations. Defaults to `idle`.                                                                                                                                                                                                                                                                                                       | `"active" \| "idle" \| "thinking" \| "typing" \| "waiting" \| "working"` | `'idle'`                                     |
| `variant`    | `variant`     | Selects the avatar's visual style. The `detailed` variant is the fully detailed orb; the `minimal` variant is a simplified design with a single gradient orb, a stroked outline, and a soft halo. Eye and mouth shapes (and all animations driving them) are shared across variants.                                                                                                                                                      | `"detailed" \| "minimal" \| "outlined" \| "solid"`                       | `'minimal'`                                  |


## Dependencies

### Used by

 - [limel-example-ai-avatar-basic](examples)
 - [limel-example-ai-avatar-branded](examples)
 - [limel-example-ai-avatar-export](examples)
 - [limel-example-ai-avatar-mode](examples)
 - [limel-example-ai-avatar-variant](examples)

### Graph
```mermaid
graph TD;
  limel-example-ai-avatar-basic --> limel-ai-avatar
  limel-example-ai-avatar-branded --> limel-ai-avatar
  limel-example-ai-avatar-export --> limel-ai-avatar
  limel-example-ai-avatar-mode --> limel-ai-avatar
  limel-example-ai-avatar-variant --> limel-ai-avatar
  style limel-ai-avatar fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
