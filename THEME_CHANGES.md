# Spark Theme Migration — PR Summary

**Date:** 22 April 2026  
**Repos:** `sunbird-collection-editor` · `editor` (QuML / questionset-editor)

---

## Non-CSS changes and why they were needed

### `angular.json` — global stylesheet registration

**Why:** The Spark theme is delivered through SCSS files that Angular must know about at build time. Without registering them in `angular.json`, the browser never loads the token definitions and every `var(--spark-*)` call renders as an empty value — components appear unstyled.

**What changed:** Added the following files to the `styles` array for both the library build and the test/demo app:

```json
"src/assets/lib/semantic/semantic.min.css"  ← Semantic UI base (required for all .ui.* overrides to work)
"node_modules/font-awesome/css/font-awesome.css"
"node_modules/katex/dist/katex.min.css"     ← maths equation rendering
"src/assets/styles/styles.scss"             ← entry point that imports _spark-aliases, _variables, _spark-overrides
```

Without this, the overrides in `_spark-overrides.scss` and `_spark-aliases.scss` simply would not be applied.

---

### `package.json` / `package-lock.json` — dependency additions

**Why:** Two capabilities needed for the Spark UI were not present in the project:

| Package | Reason |
|---|---|
| `@angular-devkit/core` re-pinned | Kept in sync with the Angular CLI version in use; avoids build-time version mismatch warnings that block the CI pipeline |

The `package-lock.json` change (1113 lines) is the automatic lockfile update — it contains no intentional logic changes.

> **Note:** `svg2img` was mistakenly added in this commit and is not used anywhere in the codebase. It has since been removed from `package.json`.

---

### `library-list.component.html` — "Add to Library" button disabled state

**Why:** Previously the **Add to Library** button had no awareness of whether a content item had already been added to the collection. Users could click it multiple times, triggering duplicate API calls and adding the same resource twice.

**What changed:**

```html
<!-- Before -->
<button class="sb-btn sb-btn-dark-green ..." (click)="addToLibrary()">

<!-- After -->
<button class="sb-btn sb-btn-dark-green ..."
  [disabled]="content.isAdded"
  [class.disabled]="content.isAdded"
  (click)="addToLibrary()">
```

Binds `disabled` and the `.disabled` CSS class to the `isAdded` flag on the content object. The SCSS for `.sb-btn-dark-green.disabled` (added in the same commit) then applies the greyed-out appearance. The button is functionally and visually disabled once the item is in the collection.

---

### `library-player.component.html` — video preview "Add" button and click area disabled state

**Why:** The same duplicate-add problem existed in the **library player** (the right-hand video/PDF preview panel). The entire click zone and the Add button remained active after a resource was added.

**What changed:**

```html
<!-- Before -->
<div class="... content-video__player__screenpart" (click)="addToLibrary()">

<!-- After -->
<div class="... content-video__player__screenpart"
  [class.pointer-events-none]="contentListDetails?.isAdded"
  (click)="addToLibrary()">

<button ... [disabled]="contentListDetails?.isAdded"
             [class.disabled]="contentListDetails?.isAdded">
```

- `pointer-events-none` on the wrapper div blocks click-through on the whole preview area once the item is added.
- `[disabled]` and `[class.disabled]` on the button apply the same visual + functional lock as in `library-list`.

---

## CSS / SCSS changes — summary

All SCSS changes belong to one continuous goal: replacing the old generic palette (`--white`, `--gray-100`, `--primary-400`, etc.) with the Spark token system and ensuring every component uses the canonical values.

| Phase | What happened |
|---|---|
| Initial port (`11f2030`) | Spark colours introduced into `_variables.scss`; `_spark-overrides.scss` rewritten for Semantic UI; component SCSS updated |
| Token file (`534882a`) | `_spark-aliases.scss` created as single source of truth; imported first in `styles.scss` |
| Direct token substitution (`df2a2cca`) | All `--white`, `--gray-*`, `--primary-*` replaced with `--spark-*` tokens |
| Alias layer (`88e2dc4c`) | `--color-*` friendly aliases added to `_spark-aliases.scss`; all files updated to use aliases instead of raw token names |
| Visual tuning (`95f978fa`) | Alias values corrected — hover rows were near-invisible, selected rows were the wrong green; borders were too faint |
| Build fix (`7552dd71`) | Removed broken `url(fancytree-loading.gif)` reference left in minified CSS after the GIF was deleted |
| Modal fix (`bd9839cd`, `e9aa2e58`) | Suppressed Semantic UI's `position:static!important` on scrolling modals which was breaking modal placement |
