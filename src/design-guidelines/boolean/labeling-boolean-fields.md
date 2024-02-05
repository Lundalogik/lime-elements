# Labeling boolean fields

Boolean fields like [Checkbox](#/components/limel-checkbox/) and [Switch](#/components/limel-switch/) are used in different contexts. For example, they could be used in

1. _lists_ or _groups_, such as in a "Settings page",
2. a form, such as a "Registration form" or a survey,
3. a "Task list" or "Checklist",
4. or in `readonly` mode in a UI, to dynamically visualize some data which is being retrieved from a database.

The context in which these two boolean fields are used has a decisive impact on how you should formulate the their labels.

## 1. In Settings Pages

When a boolean input field is used in the context of a "Settings page" or "Preferences page", the label would simply reflect the setting or the feature which is enabled or disabled by the boolean field, and it is normally a noun.

Check out [Switch vs. Checkbox](#/DesignGuidelines/switch-vs-checkbox.md/) for examples and best practices.

## 2. In Forms

Boolean questions, also known as Yes/No questions, are frequently used in forms or questionnaires. These questions are typically formatted in a descriptive manner, followed by a pair of opposing answers, usually represented as radio buttons. For example:

<limel-example-boolean-radio-buttons><limel-example-boolean-radio-buttons />

Alternatively, a single checkbox can also be used to represent a boolean question. Unlike a group of radio buttons, a checkbox provides the respondent with the flexibility to deselect their answer or leave it unanswered if the question is not mandatory. For example:

<limel-example-boolean-checkboxes><limel-example-boolean-checkboxes />

In such scenarios, it's crucial to ensure that the label accurately describes the context in the form of a phrase or sentence. Additionally, using a helper text can provide further clarification about the function of the checkbox.

## 3. In Task lists or Checklists

Boolean fields are frequently utilized in user interface design, particularly for creating checklists or task lists. These interfaces often take the form of wizards or multi-step processes, requiring users to check off tasks or items as they progress.

Consider the scenario of field workers, auditors, or inspectors who are on assignment. They need to complete a form to confirm that all checks were performed in accordance with a specific protocol. For example:

<limel-example-audition-form><limel-example-audition-form />

However, there is another side of designing such user interfaces. These forms could have two groups of users. One group is the users who actively fill-in the information, and the second group is the one who sees the results or reports from the checklist.

The data could be presented in a `readonly` format to the second group, and here is when the choice of proper labels really matter. Read more about this in the next section…

## 4. In Readonly Mode

In `readonly` mode, the data is presented to users. So the boolean field is only visualizing the data (read more on [disabled vs. Readonly](#/DesignGuidelines/disabled-vs-readonly.md/)). however, the default visual design of the `readonly` mode does not always clearly communicate the meaning of the presented data to the end users and can therefore result in confusion.

In short, the reason end-users become confused is that it is often not enough to keep the same label for both `true` and `false` states,
and only rely on toggling the color or the shapes and visual motifs, to communicate what the field means.

Instead, we need to use different labels to describe the state, and also get some additional help from icons and colors to clarify further if needed.

The subtle details of icons and colors significantly impact user perception. However, among these details, the field label stands out as a crucial element that defines the data's meaning for end users.

In the example below, some fields are `true` and some are `false`. Notice how much better the elaborated labels are in this example, and how everything makes more sense for a reader when the fields are `readonly`. They are still not perfect, but certainly clearer than the previous example.
<limel-example-audition-form-readonly><limel-example-audition-form-readonly />

Next example shows how the additional readonly-related props of [Checkbox](#/components/limel-checkbox/) and [Switch](#/components/limel-switch/) (`trueLabel`, `falseLabel`, `trueIcon` and `falseIcon` from the `ReadonlyProps` interface) can be used to enhance the perception and experience of the users.

<limel-example-readonly-props><limel-example-readonly-props/>

---

### Best practices for labeling boolean fields for checklists and readonly mode

The name or label of a boolean field should be as descriptive as possible. But as described above, what "descriptive" means depends on the context. Here are some best practices, for usage in the context of checklists and task lists:

1. **Avoid using nouns:** Using single nouns would work fine for a settings page, when the boolean turns a feature On or Off. But in a checklist or when the boolean fields are used for visualizing data (in readonly mode), it is better to avoid nouns as labels. Phrases or sentences would be more descriptive.
1. **Use Positive Phrasing:** Just like the convention of naming boolean variables in coding, the name of the boolean fields should be positively phrased. For example in code, you would name a boolean prop like this: `isActive` or `isEnabled` (which are easier for a human brain to understand than `isNotActive` or `isDisabled`). In a UI design, it is even more important to follow this practice.
1. **Avoid Negatives:** Avoid negative words in your boolean variables. For example, "Is not active" or "Is inactive" is confusing. It's better to use "Is active".
1. **Be Specific:** The name should clearly indicate what the variable represents. For example, "Subscribed for newsletters" is way better than "Newsletter".
1. **Use Prefixes:** It's common to prefix boolean variables with **is**, **has**, **can**, or **should**. This makes it clear that the variable is a boolean and what it represents. For example, "Has dept", "Has permission".
1. **Consider the Context:** The name should make sense in the context where it's used. For example, if you have collapsible section called _Coworker_, a boolean name of "Is active" does not makes sense in that section. It is better to name the field as "Is still working". While if the collapsible section is called _Subscription_, then "Is active" makes sense.
1. **For `readonly` mode, consider providing two labels:** Consider using `trueLabel` and `falseLabel`, to make it crystal clear to the reader what the data is about.
