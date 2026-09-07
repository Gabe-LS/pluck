# Pluck — Extract page elements as HTML with inline CSS or Markdown

A Chrome DevTools sidebar extension that copies the selected element with all computed styles inlined as clean HTML — or converts it to Markdown with one click.

![Pluck sidebar in DevTools](store/screenshots/02.png)

## Features

- **Copy as HTML + inline CSS** — self-contained HTML with only meaningful styles (not all 400+ computed properties)
- **Copy as Markdown** — clean Markdown conversion via Turndown.js
- **Smart style extraction** — iframe-based baseline comparison, attribute-aware defaults, inherited property deduplication, shorthand reconstruction
- **Pseudo-element capture** — `::before`/`::after` content converted to real elements
- **Hidden element exclusion** — skips `display:none` and `hidden` elements
- **Framework attribute stripping** — removes Angular, React, Vue, Ember, Astro attributes
- **Preview panel** — syntax-highlighted HTML, Markdown code, or rendered Markdown preview
- **Element highlight** — overlay on the page to visualize the selected element
- **Download** — hold Alt to download as `.txt` or `.md` instead of copying
- **Dark/light theme** — matches your DevTools settings
- **Works in Chrome and Brave**

## Install

### From source (developer mode)

1. Clone this repository
2. Open `chrome://extensions` (or `brave://extensions`)
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `extension/` folder
5. Open DevTools (F12) → Elements panel → **Pluck** sidebar tab

### From Chrome Web Store

Coming soon.

## How it works

Pluck uses `chrome.devtools.inspectedWindow.eval()` to run extraction code in the inspected page context. The extraction engine:

1. Creates a hidden iframe with a clean document (no author stylesheets) as a baseline
2. For each element, compares its computed styles against a same-tag baseline element
3. Keeps only properties that differ from defaults, applying smart filters:
   - Attribute-aware baselines (`<a href>` defaults differ from `<a>`)
   - Inherited property deduplication (only re-declares when values change from parent)
   - `currentColor`-based property filtering
   - Conditional drops (background sub-properties when no image, outline when no style, etc.)
   - Context-aware drops (flex properties on non-flex children, grid on non-grid, etc.)
   - Shorthand reconstruction (margin, padding, border, flex, gap, inset, text-decoration, etc.)
4. Captures `::before`/`::after` pseudo-element content as real `<span>` elements
5. Strips framework attributes and skips hidden elements
6. Returns clean, self-contained HTML

## Project structure

```
extension/           Chrome extension source (load this folder)
  manifest.json      Manifest V3
  devtools.html/js   DevTools page — creates the sidebar pane
  sidebar.html/js    Sidebar UI — buttons, options, preview
  extractor.js       Style extraction engine (runs via eval)
  prism.js           Syntax highlighting (Prism.js)
  prism-markdown.js  Prism Markdown grammar
  prism-devtools.css Custom Prism theme matching DevTools colors
  turndown.js        HTML to Markdown (Turndown.js)
  marked.js          Markdown to HTML rendering (Marked.js)
  LICENSES           Third-party license notices
  icons/             Extension icons (16, 48, 128px)
store/               Chrome Web Store assets
  screenshots/       Store listing screenshots
  promo-small-440x280.png
  detailed-description.txt
  privacy-policy.txt
  build-zip.sh       Builds the submission ZIP
tests/               Playwright test infrastructure
  launch.js          Shared browser launcher
  smoke.spec.js      Extension load test
```

## Build for Chrome Web Store

```bash
bash store/build-zip.sh
```

Creates `store/pluck-extension.zip` with `manifest.json` at the root.

## Development

```bash
npm install
npx playwright install chromium
npm test
```

Tests run against live websites with a real browser and the extension loaded.

## Credits

- Icon designed by [IwitoStudio](https://www.flaticon.com/authors/iwitostudio) from [Flaticon](https://www.flaticon.com)
- [Prism.js](https://prismjs.com/) by Lea Verou — syntax highlighting (MIT)
- [Turndown](https://github.com/mixmark-io/turndown) by Dom Christie — HTML to Markdown (MIT)
- [Marked](https://github.com/markedjs/marked) — Markdown to HTML (MIT)

## Privacy

Pluck reads page content solely to extract the selected element. No data is transmitted, stored remotely, or shared with any third party. All processing happens locally in your browser.

## License

MIT
