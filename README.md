# biobotproject-org.github.io

The BioBot project website and documentation, built with
[Docusaurus](https://docusaurus.io/) and published to GitHub Pages by
the workflow in `.github/workflows/deploy.yml` on every push to `main`.

```sh
npm ci          # install
npm start       # local dev server with live reload
npm run build   # production build into build/
```

Docs live in `docs/`, the landing page in `src/pages/index.js`, and the
BOM calculator in `src/components/BomCalculator.js`.

Website code is Apache-2.0. Documentation text is CC BY 4.0.
