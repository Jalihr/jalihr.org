# jalihr.org

The JaliHR marketing website. Plain HTML and CSS, no build step.

Published with GitHub Pages from the `main` branch. Any commit to `main` is
live on https://jalihr.org within about a minute, so editing a file here is
the whole deploy process.

## Layout

Every page other than the homepage lives in its own directory as `index.html`,
so it serves at a clean URL with no `.html` extension (e.g. `resources/index.html`
is `https://jalihr.org/resources/`). All internal links, and every reference to
`/assets/...`, use absolute paths for this reason — a relative link from a page
inside a directory would otherwise resolve one level too deep.

```
index.html                                   Home (https://jalihr.org/)
about/index.html                             About
academy/index.html                           JaliHR Academy (coming soon)
advisory/index.html                          Advisory (coming soon)
blog/index.html                              Blog listing
blog-1/index.html                            Blog post 1: employee financial wellness research
calculator/index.html                        Calculators
documentation/index.html                     Documentation (coming soon)
financial-wellness-diagnostic/index.html     Financial wellness diagnostic quiz
get-started/index.html                       Get started (coming soon)
legal/index.html                             Legal (coming soon)
privacy-policy/index.html                    Privacy policy (coming soon)
rescue/index.html                            HRIS Rescue / consultancy (formerly the homepage)
resources/index.html                         Resources
whistleblower-policy/index.html              Whistleblower policy (coming soon)
workplace-banking-options/index.html         Workplace banking options
assets/css/style.css                         Main stylesheet
assets/css/nav.css                           Shared top nav, used by every page but the homepage
assets/css/calculator.css                    Calculator page layout
assets/js/main.js                            Mobile nav and scrolled header
assets/js/calculator.js                      Calculator logic (MISSING, see below)
CNAME                                        Custom domain for GitHub Pages
```

## Known gaps

- `assets/js/calculator.js` was not included in the files recovered from
  Slack, so the calculators on `calculator/index.html` render but do not
  compute. The page needs the original file.
