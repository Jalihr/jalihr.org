# jalihr.org

The JaliHR marketing website. Plain HTML and CSS, no build step.

Published with GitHub Pages from the `main` branch. Any commit to `main` is
live on https://jalihr.org within about a minute, so editing a file here is
the whole deploy process.

## Layout

```
index.html                        Home
what-we-do.html                   What We Do
calculator.html                   Calculators
financial-wellness-report.html    Research report
financial-wellness-diagnostic.html
pricing.html
resources.html
workplace-banking-options.html
assets/css/style.css              Main stylesheet
assets/css/calculator.css         Calculator page layout
assets/js/main.js                 Mobile nav and scrolled header
assets/js/calculator.js           Calculator logic (MISSING, see below)
CNAME                             Custom domain for GitHub Pages
```

## Known gaps

- `assets/js/calculator.js` was not included in the files recovered from
  Slack, so the calculators on `calculator.html` render but do not compute.
  The page needs the original file.
- The pages carry `og:url` and `hello@` addresses on `jalihr.live`, which is
  not a registered domain. They should point at `jalihr.org`.
