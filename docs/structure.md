# Website Structure

Run `pnpm dev` from the repository root. Pages remain standalone HTML entries.

- `index.html`, `blog.html`, `blog-post.html`, `friends.html`, `support.html`: page markup and content.
- `scripts/shared/`: shared navigation and scroll-progress component. Load each once per page.
- `scripts/support/`: support-only behavior. `index.js` initializes the page after currency, cards, translations, metrics, and UI helpers load.
- `scripts/app.js`, `scripts/i18n.js`: existing personal-site initialization and translations.
- `styles/navigation.css`: shared navigation styling.
- `styles/support.css`: support stylesheet entry; feature styles live in `styles/support/`.
- `styles/catime-style.css`, `styles/modules/`: inherited support-page base styles, isolated from the personal-site base stylesheet.
- `assets/`: images, project logos, and payment images.
- `blogs/`: Markdown articles and their images.

The scroll-progress component owns its markup, scroll events, progress calculation, and keyboard interaction. Pages must not add another copy or initialize their own scroll-progress handlers.

Classic scripts and Markdown resources are copied by the Vite runtime-files plugin when building. `dist/` and `node_modules/` are generated and ignored by Git.
