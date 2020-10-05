# Size rhythms

When designing components and layouts, you will have to specify the size of many properties such as `padding`, `margin`, `grid-gap`, `width`, `height`, and so forth.

To generate a consistent layout and visual expression, we only use sizes that are multiples of four (4 * x). For example 4, 8, 12, 16, 20, and so on.

It is very important to follow this convention, both when creating new components for Lime Elements, and when creating bigger components and layouts which use these components. When the entire interface is calculated based on the single core value of 4, elements of the UI will align auto-magically.

For instance, if you want to create a custom row of buttons (not directly using Lime Elements) with this sizing convention, its `height` and `line-height` can be 40 units (to vertically align the text inside the button), the `padding-left` and `padding-right` can be 12 units, and its `margin-left` and `margin-right` which set the distance to the next or previous buttons can be for example 4 or 2, or in this example 6.

Even though 6 is not a multiple of 4, it sums up to a 12 units distance between two buttons in a row; and since 12 is a multiple of 4, the overall result will be in line with the 4x rhythm 👍

<limel-example-size></limel-example-size>


## REM or PX
We only use `rem` units in our design system. `1rem` equals the font size set in the browser, and defaults to `16px` in most browsers. In such a system, multiples of 4px (our core size unit) can easily be calculated, as they increase sequentially by `0.25`.

* 4 px = 0.25 rem
* 8 px = 0.5 rem
* 16 px = 1 rem
* 20 px = 1.25 rem
* 24 px = 1.5 rem

However, while designing a UI, it may be easier to think in pixels, as rem is more abstract. By using a custom SASS function like below, you can effortlessly leave the job of unit conversion to the computer.

````css
// first define this converter function in your SCSS …
@function pxToRem($px) {
    @return #{$px/16}rem;
}

// … and then use it to ease calculations
.example {
    width: pxToRem(4); // will be compiled to 0.25rem
}
````

**Note** write `1px` not `0,0625rem`!

Anything that should get rendered in `1px` on a screen (such as a border) should be written in pixels. It's very important not to write it in its rem equivalent (`0,0625rem`). This is because depending on the physical pixel density of the screen, a `0,0625rem` thick line might be rendered as a semi-transparent line, or, even worse, not be rendered at all.

## Exceptions in sizing rhythms
There are exceptions where we do not have to follow the above-mentioned sizing convention (multiples of 4). These exceptions are:
* Numbers `1` and `2` are allowed to use when defining some visual details such as borders.
* `font-size`: how fonts are rendered depend on the typography and design of the font itself. Fonts do not follow the same logic of simple geometric shapes of the UI. Therefore, using incremental rhythm based on 4 for font sizes (e.g. for H1, H2, H3, etc...) may generate huge font sizes which won't be usable. Also other numbers such as 14 or 13 may appear more appealing for a balanced and easily readable text, compared to 16, or 12.
* `border-radius`: when it comes to border radius, multiples of 4 may render too large or too small. Pick the value that best helps the visual expression you want to achieve, even if it's not a multiple of 4.
* `box-shadow`, `drop-shadow`, `blur`: How far a shadow reaches until it's faded out, or how blurry something looks should also be flexible depending on the visual expression that you want to achieve.

## Be a believer, but not a fanatic!
This is about having a consistent rhythm in the UI, not about religiously following hard guidelines. In some cases, you will find yourself in situations in which some small detail in the UI is not following the 4-units rhythm, while everything else does.

Let's look at the example below:

<limel-example-size-edge-case></limel-example-size-edge-case>

Here you see that the distance between the picture and top, bottom, and left of the rows is 6 units. However, the `line-height` or `height` of the picture itself (and other details) are multiples of 4. Now this is a made up example for illustrative purposes, but cases like this may happen in real life when designing components and layouts. For example you may choose to use 6 units for distance on a certain type of screen to achieve a higher visual density.

So, if you can justify that 6 works fine for your design, and the rest of your structure is following the 4x rhythm; then go for it! In this example, the accumulated height of the row (which is more decisive for the general rhythm) will be 24 (4 * 6). So you don't "have to" change 6 to 4 or 8 so that all numbers become multiplies of 4.

The only thing you should be mindful of is whether you are getting too many of these exceptions within the same component. In that case, something is wrong in your design.
