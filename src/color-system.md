# Color system
By taking advantage of CSS variables, we have created a harmonic and pleasing color system that aims to ease the job of picking the right colors for components. These colors are inspired by [Material Design's 2014 color palettes](https://material.io/design/color/the-color-system.html#tools-for-picking-colors). However, we have modified them, renamed them, added new swatches, and also divided them into different subsets of colors which automatically adjust to Dark and Light themes.

## Color palettes
The color system offers a few sets of colors which we call "palettes". Each palette includes a number of swatches, each of which automatically adjusts itself to the light and dark themes. In other words, each swatch has only one name, but two versions; a brighter one which is displayed when light mode is activated, and a slightly dimmer tone of the same color which is displayed when dark mode is activated. You don't really have to care about this, and all you need to do is pick a color and use its CSS variable name in your code.

### Color swatch names
<limel-example-extended-color-palette></limel-example-extended-color-palette>

The color system consists of 20 base colors or "hues". Each hue has five variations: one default, two tints (light and lighter), and two shades (dark and darker); and this is simply how we have named their CSS variables. The `red` color for instance has the following variable names:

`--color-red-lighter` →  `--color-red-light` →  `--color-red-default`→  `--color-red-dark` →  `--color-red-darker`

### Contrast swatch names
<limel-example-contrast-color-palette></limel-example-contrast-color-palette>

The contrast swatches are used to clarify the generic and neutral UI elements such as backgrounds, containers, sections, and their textual content. Using them wisely will help create a sense of hierarchy as well as improved readability. CSS variable names for contrast swatches start with a prefix of `--contrast-` followed by a number. These numbers start at `100` and incrementally increase by 100 and stop at `1700`, such as:

`--contrast-100` → `--contrast-200` → ··· → `--contrast-1600` → `--contrast-1700`

**Note** that you should never use these swatches when you are coloring something (like a colorful icon or illustration). Because these swatches will dramatically change their colors and get inverted in dark and light modes. So if you want something to have a shade of grey, or appear black or white all the time, then you should use the swatches from the color palette instead, not from this contrast palette, as they invert with modes.

**Note** that `--color-white` and `--color-black`, which are displayed beside the contrast swatches do not change in dark and light modes. These variables can be used, for example, in shadows (which remain black even in dark mode) or text colors on colored buttons.

### Dark mode, light mode, accessibility

**Note:** don't confuse titles like "dark mode" and "light mode" or "dark/light themes" with these swatches' naming convention. As mentioned above, each swatch -despite its name- already comes with two tones inbuilt into the color system. For example the `--color-red-dark` variable will automatically be displayed as `#d32f2f` in light mode, and as `#c62828` in dark mode.

<limel-example-dark-light-mode></limel-example-dark-light-mode>

The reduced brightness in dark mode is set with accessibility in mind, and will help reduce users' eye strain in low-light environments. In a proper design for dark mode, it is not enough to invert the background and text colors. Colors which are bright in light mode, will appear even brighter in dark mode and therefore pop out more from the UI, which can make the UI unpleasant or harder to look at.

#### Elevated objects and contrast
In the above example, the card is using a contrast variable which is lighter than its background layer; which means it will become darker than its background in dark mode as colors invert. However, we believe that this would create a strange experience for the users. Thus we manually specify a "lighter" background color for dark mode.

The reason for this is that the card has an elevated effect with a drop shadow. Such visual effects (depth, movement, light direction and its effects, etc...) rely on our experiences from the physical world and try to mimic what happens in reality. Because human brain normally expect deeper objects to appear darker and vice versa, we have added a lighter color to the card for it to still be "elevated". This not only helps users' perception of the interface on an unconscious level, but also keeps the shadow effect more visible.

## Usage

**Note:** *Work in progress!* We are currently in the process of transitioning Lime Elements to eventually fully support dark mode. During this process, we recommend that any clients using Lime Elements load `@limetech/lime-elements/dist/lime-elements/style/color-palette-extended-light-mode-only.css`, where dark mode support is completely disabled, to avoid inconsistent behavior. To get dark mode support, to the extent available at the time, load `@limetech/lime-elements/dist/lime-elements/style/color-palette-extended.css` instead.

### Using CSS variables
We have not used HEX values to create the CSS variables for each color. They are instead written in RGB digits, without parentheses. For example `--color-blue-default: 33, 150, 243;` (which would be `#2196f3` in HEX). The reason for such a choice is empowering you to write the colors with alpha channel if needed.

Thus, to get a solid blue color, you would write `color: rgb(var(--color-blue-default));`.  
To get a blue color with 10% opacity, write `color: rgba(var(--color-blue-default), 0.1);` instead.

### Customizing our components and your apps with colors
When using web-components from Lime Elements, you will notice that there are many components which allow you to add colors. However, since Lime Elements is a design system intended to unify the look and feel of our products, we naturally try to reduce your styling choices. So this color customization will enable you to either add an accent color (e.g. your product color) to the component, or add colors that contribute the the functionality of the component (e.g. indicating a status such as error, danger, etc).

But when you do your own add-ons, integrations, and apps, keep in mind that the UI should be neutrally colored (using the contrast scales). Applying intensive colors to big areas of the UI (such as headers and background colors) is not recommended.

Colors should be used to communicate meaning, and attract attention to things that are functionally important, not to scream your brand throughout the entire product. Different sections of the app should be distinct, but also blend together well. Extensive color usage will be placing the emphasis on an app’s UI structure, instead of its content.

Use only one accent color (product color) and use it for all Lime Elements components in your product. Define this accent color by setting the CSS variable `--lime-primary-color`. We don't recommend using the Lime brand color CSS variables directly in this case, but instead suggest using their equivalent swatch from the color palette. This will ensure that your UI will automatically benefit from dark mode adjustments, while users do not notice the difference.

Things that can be affected by the accent color:
* In buttons: background color of primary buttons
* In check boxes: background color of “checked” boxed
* In radio buttons: background color of “checked” buttons
* In inputs: the underline visual effect
* In linear progress: color of the progressed section and what’s left (its background)
* In many components: the visual styles that indicate the `focused` state (using keyboard)
* In many components: the visual styles that indicate the `active` or `selected` state
* etc…

What colors you can optionally change to communicate meaning:
* In buttons: text color, and also background color of buttons with certain functionalities (delete, restore, etc)
* In badges: color of the page and its text color
* In linear progress: color of the progressed section and what’s left (its background)
* etc…

<limel-example-colors-in-components></limel-example-colors-in-components>



### Available palettes
All CSS variables for the colors are available, so you *could* pick any name and use it in your work. But please do not abuse this flexibility!

Extensive usage of colors will create a messy and inconsistent UI. Most of your UI design needs should be resolved using the swatches in the "UI palette" (illustrated below), in addition to the contrast palette. If you need more colors, try to stick to the swatches available in the "Primary palette". The "Extended palette" should be used only for very rare cases.


#### **UI palette** (default)

<limel-example-ui-color-palette></limel-example-ui-color-palette>

This includes 10 color swatches which give you colors that you normally need in a user interface. These few, hand picked swatches add an extra layer of meaning to elements of the interface and make it possible to quickly communicate what the element does or indicates.

In this palette, there is a `-default` and a `-light` swatch available for each hue. The `-light` tints are usually good to use when creating interactive visual feedback. For example a button that has `--color-green-default` as background color, can get `--color-green-light` when it is hovered by the cursor.
___

#### **Primary palette**

<limel-example-primary-color-palette></limel-example-primary-color-palette>

Sometimes, just a handful of colors is not enough and you need a bit more. For example when you need colors for your icons, or diagrams. This palette with 40 swatches is designed to provide a decent number of harmonic colors while easing the choice of colors for you. Used for primary purposes and meaningful communications with colors.

___

#### **Extended palette**

<limel-example-extended-color-palette></limel-example-extended-color-palette>

With 100 swatches, this palette offers a much richer set of colors that can be used for visual communication, iconography, illustrations, and charts.
___

## Lime Technologies Brand Colors
<limel-example-brand-color-palette></limel-example-brand-color-palette>

This set of colors is included in all available palettes, and can be used for branding and marketing purposes. Swatches and their respective CSS variables have specific names starting with the prefix `--lime-brand-color-`.

**Note** that the brand colors do **not** have a dark and light version. Thus when their respective CSS variable names are used, they will be displayed with the same brightness in both light and dark UIs. However, an equivalent of all these hues already exist in our color palette, and mostly reside in the "dark mode" subset -as stated beside their names as well.

**Note** that names of our brand colors are chosen by our Marketing department thus sometimes do not exactly match our naming conventions for their equivalent hues in the color palettes.

### Usage of brand colors
For correct use of Lime Technologies brand assets, including colors, please refer to [Lime Technologies brand guidelines](https://www.lime-technologies.se/brand-guidelines/).

We recommend relying on the "UI palette" and avoid using brand colors extensively in UI design. Brand colors -as their name states- should be used where appropriate, to reflect the company's brand and identity; and add brand-recognizability to the product. These should be used the way you use spices in cooking. Too much and too many of them together will destroy the food. Therefore, in UI design, usage of brand colors should be very limited.

Good places to use brand colors are:
- in loading screens or splash screens
- in logos or home links
- as accent colors, but carefully! This depends on the color which is chosen to represent the product. For example `deep-red`, `yellow`, `light-grey` or `grey` can never be good accent colors, even if they can be chosen to represent a Lime product.
