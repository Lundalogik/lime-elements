# Typography

Typography in UI design plays a crucial role in creating an aesthetically pleasing and user-friendly experience. It involves the art and technique of arranging and styling text to make it readable, engaging, and visually appealing. Proper typography enhances the overall design, conveys the right message, and guides users through the content.

Font style is important in web design for several reasons:

**Readability:** The font style can affect how easily the text can be read by users. A font that is too small or too difficult to read can cause users to leave the website or not engage with the content.

**Branding:** Font styles can also contribute to the branding of a website. A font can help to convey the personality and values of a company or website.

**User experience:** Font style can impact the overall user experience of a website. A font that is too flashy or distracting can detract from the user's ability to navigate and interact with the website.

**Accessibility:** Font style can also play a role in the accessibility of a website. Choosing a font that is easy to read for those with visual impairments can help to ensure that all users are able to engage with the content.

Overall, font style is an important aspect of web design that can have a significant impact on the success of a product.

## Font family

The font-family property is used to define the font or set of fonts that should be used for text on a web page. The font-family property allows designers to specify a list of font families, in order of preference, that the browser should use to display text. If the first font family is not available on the user's device, the browser will move on to the next font family in the list until a suitable font is found.

The font-family property can also be used to specify different fonts for different elements on a web page, such as headings or captions. For our products a t Lime we use Roboto and as the fallback sans-serif.

```css
font-family: Roboto, sans-serif;
```

## Font style

The default font style is often set to "normal" for a number of reasons:

**Consistency:** Using a normal font style as the default ensures that the text on a website is consistent and easy to read. It is a simple, classic style that is widely used and recognized.

**Accessibility:** Normal font styles are often easier for users with visual impairments to read, as they are typically simpler and less stylized than other font styles.

**Flexibility:** Normal font styles are versatile and can be used in a variety of contexts, from body text to headings to captions. They can also be easily combined with other font styles and sizes to create a more dynamic and visually interesting design.

**Performance:** Using normal font styles can also help to improve website performance, as more complex font styles and sizes can sometimes cause slower page load times.

The use of normal font styles in CSS is a best practice that helps to ensure that text is readable and consistent across a website, while also being flexible and easy to work with in the design process.

```css
font-style: normal;
```

## Font size

The ideal font size for a website depends on several factors, including the font style, the type of content being presented, and the overall design of the website. However, in general, the font size should be large enough to be easily read by the majority of users, but not so large that it takes up too much space on the page or looks unprofessional.

The most common font sizes for body text on our products are typically between 14 and 16 pixels, although this can vary depending on the specific font being used.

Headings and subheadings may be larger, typically ranging from 18 to 36 pixels, depending on the hierarchy of information on the page.

Some examples of using different font sizes in Lime products.

```css
.header {
    font-size: 16px;
}
```

```css
.title {
    font-size: 14px;
}
```

```css
.subtitle {
    font-size: 13px;
}
```

## Font weight

Font-weight is a CSS property that sets the weight (or thickness) of the characters in a font family. The weight can range from 100 (thin) to 900 (bold).

We use **500** for making **text bold**. The normal font-weight is 400.

```css
.header {
    font-weight: 500;
}

.description {
    font-weight: 400;
}
```
