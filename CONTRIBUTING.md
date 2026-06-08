# Contributing to Floop Feedback Tools

This checklist keeps the project documentation in sync every time a new page or JS file is added. Follow it from top to bottom — none of the steps are optional.

---

## Adding a new HTML page (`*.html`)

1. **Tools and Pages table** (`README.md`) — Add a row with the filename, short name, and a one-sentence description.

2. **Project File Structure** (`README.md`) — Add a line for the new file in the ASCII tree.

3. **External Dependencies** (`README.md`) — If the page loads any CDN library or third-party service not already listed, add a subsection using the existing entries as a template:
   - Source URL
   - Version (if known)
   - Used in (list of files)
   - Purpose (one sentence)

4. **Inline attribution comments** — Directly above every `<script src="...">` or `<link rel="stylesheet" href="...">` that loads an external resource, add a comment in this format:
   ```html
   <!-- External library: <Name> (<purpose>) — <URL> -->
   <script src="..."></script>
   ```
   For embedded third-party content such as iframes:
   ```html
   <!-- External content: <Name> — hosted and served by <Provider>, not project code -->
   ```
   Files that use only local project assets do not need this comment.

---

## Adding a new JavaScript file (`assets/js/*.js`)

1. **Project File Structure** (`README.md`) — Add a line for the new file in the ASCII tree.

2. **Dependency comment block** — If the file reads any global variable provided by an external library (for example `React`, `ReactDOM`), add the following block at the very top of the file:
   ```js
   /*
    * External dependencies (loaded as browser globals by <page>.html before this file):
    *   - <Library name>  — <CDN URL>
    * All other code in this file is project code written for Floop.
    */
   ```
   If the file calls a third-party API or service endpoint, document the URL and purpose in the same block.
   Files that use only browser built-ins (DOM, `localStorage`, `fetch` to project-owned endpoints, etc.) do not need this block.

---

## Adding a new JSX source file (`src/*.jsx`)

1. **Project File Structure** (`README.md`) — Add a line for the new file under `src/`.

2. **Vite entry point** (`vite.config.js`) — Add the new file as a named entry so it compiles to `assets/js/dist/`.

3. **Run the build** — Run `npm run build` and confirm the compiled bundle appears in `assets/js/dist/` before committing.

4. **External Dependencies** (`README.md`) — If the component imports any new npm package, add a subsection documenting its source, version, and purpose.

---

## Adding a new external CDN library or third-party endpoint

1. **External Dependencies section** (`README.md`) — Add a subsection with Source, Version, the files it is used in, and its purpose.

2. **Code Attribution section** (`README.md`) — Confirm the library is used only via its published CDN or API interface — no source code is copied into project files.

---

## Quick reference

| What you added | Steps required |
|----------------|---------------|
| New `*.html` page | Tools table · File tree · External Deps (if new CDN) · Inline comments |
| New `assets/js/*.js` file | File tree · Dependency block (if uses external globals) |
| New `src/*.jsx` file | File tree · Vite entry · `npm run build` · External Deps (if new package) |
| New CDN / endpoint | External Deps · Code Attribution |
