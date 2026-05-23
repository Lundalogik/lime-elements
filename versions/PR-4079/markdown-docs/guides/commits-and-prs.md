# Commits & Pull Requests

We would love to see your PRs! Please send them our way — and when you do, please follow our **atomic commits** convention so they are easy to review, revert, and turn into a clean changelog entry.

In short:

- We use **atomic commits**.
- Each commit message follows the **Conventional Commits** format: `<type>(<scope>): <subject>`.
- The two most consequential types — `feat` and `fix` — are about **the consumer of the library** (the developer using Lime Elements), not the end-user of the app being built.

The commit messages drive our automated changelog and version bumps via [semantic-release](https://github.com/semantic-release/semantic-release), so getting them right matters.

:::tip
The `type` and the 100-character header length are enforced by [commitlint](https://commitlint.js.org/) in CI — an invalid one of those will fail the lint step. Everything else below is convention; reviewers will flag departures.
:::

---

## Atomic commits

An [atomic commit](https://en.wikipedia.org/wiki/Atomic_commit) is the smallest commit that still makes sense on its own. In practice that means:

- A commit contains **exactly one self-contained functional change**.
- A functional change is contained in **exactly one commit**.
- A commit never leaves the codebase in an inconsistent state. It means no failing tests, no failing lints, no "half-finished" features without their docs, no docs describing code that does not exist yet.

A larger feature can be split into multiple atomic commits as long as **each commit individually** keeps the repository green.

### Why it matters

- **Reviewable**: a reviewer can read one commit and form one opinion about it.
- **Revertable**: a regression can be undone by reverting a single commit, not by surgically picking apart a 2,000-line megacommit.
- **Bisectable**: `git bisect` only works if every commit builds and passes tests.
- **Honest changelog**: our changelog is generated from commit messages. If three unrelated changes hide in one commit, two of them are invisible to consumers.

### Rule of thumb

When in doubt, **make more, smaller commits**. Splitting commits later is harder than squashing them.

## Commit message format

```text
<type>(<scope>): <subject>

<body>

<footer>
```

- The **header** (first line) is mandatory. Keep it under **100 characters** — commitlint enforces this.
- The **scope** is optional but recommended — it is usually the name of the component or area affected (e.g. `chip-set`, `email-viewer`, `picker`).
- The **subject** is a succinct description of the change. By convention (not lint-enforced):
    - imperative, present tense: "add", not "added" or "adds"
    - no capital first letter
    - no trailing period
- The **body** explains _why_ the change is needed and contrasts with the previous behavior. Again, imperative present tense.
- The **footer** is where breaking changes and issue references live (see below).

### Breaking changes

If a commit introduces a backwards-incompatible change, the footer **must** start with `BREAKING CHANGE:` followed by a description of what breaks and how consumers should migrate.

```text
feat(picker): replace `value` with `values` to support multi-select

BREAKING CHANGE: The `value` prop has been removed. Use `values: string[]`
instead. To migrate, wrap any single value in an array.
```

A `BREAKING CHANGE` footer triggers a **major** version bump, regardless of the type (`feat`, `fix`, `refactor`…).

You can also signal a breaking change by adding `!` after the type/scope in the header — `feat(picker)!: …`. The `!` and the `BREAKING CHANGE:` footer have the same effect and can be used together; the footer is still the right place for the migration notes.

## Types

The allowed types are:

| Type       | What it means                                                                     |
| ---------- | --------------------------------------------------------------------------------- |
| `feat`     | A new capability **for consumers** of the library (not the end-users). See below. |
| `fix`      | Fixes a problem — bug, UX, UI, accessibility, performance regression, etc.        |
| `perf`     | A code change that **only** improves performance, without changing behavior.      |
| `refactor` | A change to internal structure. **No** change to external behavior or API.        |
| `docs`     | Documentation-only changes. See below.                                            |
| `test`     | Adds missing tests, or fixes existing ones.                                       |
| `style`    | Formatting, whitespace, semicolons. Does not affect meaning of the code.          |
| `build`    | Changes to the build system or external dependencies.                             |
| `ci`       | Changes to CI configuration and scripts.                                          |
| `chore`    | Other miscellaneous changes that don't fit any of the more specific types above.  |
| `revert`   | Reverts a previous commit. Body should contain `This reverts commit <hash>.`.     |

---

## `feat` and `fix` in Lime Elements

`feat` and `fix` drive most of our changelog entries and version bumps, so they deserve extra attention.

:::important
Because Lime Elements is a **component library consumed by other developers** (and by other libraries built on top of it), the audience for our changelog is **the consumer of the library**, not the end user of the app the consumer is building.
:::

That's just [Conventional Commits](https://www.conventionalcommits.org/) applied to a library: `feat` and `fix` track MINOR and PATCH bumps of the **public API contract**, and for a library that contract is with its consumers.

### What counts as a `feat`

A `feat` is a change that lets **the consumer** do something they could not do before. In other words, it expands the **public API surface** of the library.

Examples of `feat`:

- A **new component** is added.
- A **new `@Prop` / slot / event / public method** is added to an existing component.
- A **new exported type, interface, or enum value**.
- A new option in an existing prop's value (e.g. a new variant a consumer can opt into).
- A new CSS custom property the consumer is meant to set.

Things that are _not_ `feat`, even though they look like new functionality to a user staring at the screen:

- Visual polish where the component already looked _something like_ this — that is typically `fix` (UI issue) or `refactor`.
- Internal animations, micro-interactions, or layout tweaks the consumer cannot opt out of and did not ask for — usually `fix` if they correct a problem, otherwise `refactor`.

:::tip
Useful question: _"Can a consumer write a line of code today that they could not write yesterday?"_ If yes → `feat`. If no → probably `fix`, `refactor`, or `perf`.
:::

### What counts as a `fix`

A `fix` is a change that **removes a problem**. The problem does not need to be a "bug" in the narrow sense; it just needs to be something that was wrong.

Examples of `fix`:

- Fixes a **functional bug** — a component throwing, a prop being ignored, an event firing twice.
- Fixes a **UX problem** — a confusing interaction, an action that requires too many clicks, a tooltip that disappears too quickly.
- Fixes a **UI problem** — wrong spacing, wrong color contrast, a misaligned element, a flicker.
- Fixes an **accessibility (a11y) issue** — missing ARIA attributes, broken keyboard navigation, poor screen-reader output, insufficient contrast.
- A **performance fix** is _usually_ a `perf`, but if the performance was previously so bad it could be considered a bug, and that's been fixed, `fix` is a good fit.

A `fix` does _not_ add a new way for the consumer to do something. If your change both fixes a problem **and** introduces a new API to opt into the fix, that is usually a `feat` (or two commits: one `fix`, one `feat`).

### Not every change is `feat` or `fix`

AI assistants very often want to classify every change as either a `feat` or a `fix`, even when the change is completely internal. The Types table above lists nine other types for a reason.

- Adding a private helper function is not a `feat`. It adds nothing for the consumer; it's a `chore` or a `refactor`.
- Fixing a problem in the release workflow is not a `fix`. The consumer never sees the workflow; it's `ci`.

:::tip
Useful question: _"Does the consumer benefit from a release containing **only this change**?"_ If yes → `feat`, `fix`, or `perf`. If no → probably `refactor`, `docs`, `test`, `style`, `build`, `ci`, or `chore`.
:::

### Any change to an example is `docs`

The `examples/*.tsx` files that show up in our documentation are **part of the docs**, not part of the library's public API. **Every** change to them is a `docs` commit — including adding entirely new examples — regardless of how it looks:

- **Adding** a new example (or a new variation of an existing one) → `docs`
- Fixing a bug in an example → `docs`
- Fixing a typo in example code, labels, or comments → `docs`
- Improving an example's clarity, layout, or copy → `docs`

In other words: a new example does **not** count as a `feat`, even though something new now exists. A `feat` reaches the consumer when they upgrade the library; an example reaches the reader through the docs site.

Use a scope that points at the component the example demonstrates, e.g. `docs(button)`, `docs(chip-set)`, `docs(file-viewer)`.

## Scope

The scope is the area of the codebase the commit affects. For component changes it is the component's tag without the `limel-` prefix:

- `feat(chip-set): …`
- `fix(email-viewer): …`
- `docs(file-viewer): …`

For changes that span multiple components or are not component-specific, use a higher-level scope like `docs`, `build`, `ci`, or simply omit the scope. (Also, consider if such a commit is really an atomic commit.)

### Internal (`@private`) components

Some components in our codebase are marked `@private` in their TSDoc. These are **implementation details of other components** — their consumers are other Lime Elements components, not external developers. External consumers do not know they exist, and we do not promise anything about their API.

When you change a `@private` component, **the scope must be the public component that consumes it**, never the private one's own name. A reader of the changelog does not know what the private component is, so a scope they do not recognize is just noise.

Example: `limel-list-item` is `@private` and is consumed by `limel-list`. A fix in `list-item.tsx` should be:

- ✅ `fix(list): …` — what a consumer of Lime Elements actually experiences.
- ❌ `fix(list-item): …` — references a name external consumers have never heard of.

If the private component is consumed by several public components, scope the commit to whichever public component is most affected — or omit the scope and explain in the body.

## Subject

For `feat`, `fix`, and `perf` commits, the **subject** should focus on the change for the consumer. Any technical details should be in the body. Remember, the commit message's **subject** is what becomes the changelog entry. It should tell the consumer what to expect when they upgrade.

Other commit types are internal anyway, so the expected audience is the other developers. Still, please be thoughtful about the subject line, don't hide the most important information in the body, include it in the subject line!

## Examples

```text
feat(text-editor): support read-only mode

Render the editor in a read-only state via the new `readonly` prop, without
disabling keyboard navigation or selection.
```

```text
fix(chip-set): don't enter edit mode on chip click

Previously, clicking a chip would put the set into edit mode even when the
consumer had not enabled editing. Limit edit-mode activation to the
explicit edit affordance.
```

```text
refactor(picker): extract item-rendering into a private method

No change to behavior or public API.
```

```text
perf(list): skip re-renders when items are unchanged

Memoize the per-item key computation so identical updates no longer trigger
child re-renders. No change to rendered output.
```

```text
docs(commits-and-prs): clarify the meaning of `feat`
```

```text
feat(picker): support selecting multiple items

BREAKING CHANGE: The `value` prop has been removed. Use `values: string[]`
instead.
```

## Pull requests

A good PR is a thin wrapper around a good commit (or a small series of good commits).

We use **rebase and merge**, so your commits land on `main` exactly as you wrote them. Commit history is meant to be intentional, not accidental — there's no squash step to clean it up.

- **One PR = one concern.** If you find yourself writing "and also…" in the description, consider splitting.
- **The PR title** describes the change for humans browsing the PR list. It doesn't need to follow Conventional Commits — that's the commits' job.
- **The PR description** should explain the _why_, link the issue it closes, and call out anything reviewers should pay special attention to (e.g. tricky a11y considerations, intentional breaking change).
- **Keep the diff focused.** Reviewers can only catch problems in the changes they actually look at — sneaking an unrelated refactor into a bug-fix PR is how regressions slip through.

### Addressing review feedback

When a reviewer asks for a change that belongs in an existing commit on your branch, create a **fixup commit** rather than amending or rewriting history:

```shell
git commit --fixup=<sha-of-the-target-commit>
```

Push the fixup as-is — don't squash it into the original before pushing. The point of a fixup is to let the reviewer see exactly what changed in response to their feedback.

If the change is a new concern of its own, prefer a fresh Conventional Commit over a fixup.

CI runs a **Block Autosquash Commits** check that fails the PR while `fixup!` commits exist. That's intentional: it forces an interactive autosquash (`git rebase -i --autosquash upstream/main`) before the PR can merge, so the history that lands on `main` is the intentional one — not the back-and-forth of the review.

For the mechanics (forking, branches, opening the PR), see the repository's [`CONTRIBUTING.md`](https://github.com/Lundalogik/lime-elements/blob/main/CONTRIBUTING.md).
