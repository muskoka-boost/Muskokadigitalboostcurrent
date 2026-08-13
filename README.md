# muskokadigitalboost.ca — site source

Snapshot of the live site at https://muskokadigitalboost.ca, pulled 2026-08-13.

Static HTML/CSS/JS — no build step, no CMS, no framework. Edit the files
directly and upload them back to the server (LiteSpeed) as-is.

## Layout

```
index.html            Home
services.html         Services (anchors: #custom-websites #ecommerce
                      #landing-pages #maintenance)
pricing.html          Pricing
free-website.html     Free website offer (largest page)
about.html            About
service-areas.html    Service areas
faq.html              FAQ
contact.html          Contact
free-website-thanks.html
                      Post-submit confirmation for the free-website
                      form (noindex, not in sitemap)
404.html              Error page
css/styles.css        All styling
js/main.js            All scripting
favicon.svg           Favicon
robots.txt            Points at sitemap.xml
sitemap.xml           Lists the 8 public pages
```

All 8 pages listed in `sitemap.xml` are present, plus two pages that are
deliberately outside it (`404.html` and `free-website-thanks.html`). Every
internal link and asset reference resolves to a file in this repo, as does
the one page reference that lives in a form value rather than a link — the
`_next` field in `free-website.html`, which sends the visitor to
`free-website-thanks.html` after a successful submit.

## Previewing locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Notes for editing

- Fonts (DM Sans, DM Serif Display) load from Google Fonts at runtime, so
  the preview needs a network connection to look right.
- Contact details are duplicated in several places: the JSON-LD
  `ProfessionalService` block in `index.html`, the page bodies, and an
  email-reveal handler in `js/main.js`. Update all of them together.
- `sitemap.xml` lists only `changefreq` and `priority` — there are no
  `lastmod` dates to keep in sync. Add a new page there when you create one.

## Deploying to GitHub Pages (staging)

`.nojekyll` is committed, so Pages serves the files as-is instead of
running them through Jekyll.

This branch is set up to serve as a **staging copy** at
`muskoka-boost.github.io/Muskokadigitalboostcurrent/`, leaving the live
LiteSpeed site alone. Every link and asset reference is relative, so the
site works correctly under that subpath — verified by serving it from a
`/Muskokadigitalboostcurrent/` prefix and rendering it in a browser.

There is no `CNAME` file. Adding one claims the custom domain for Pages,
so leave it absent until you actually intend to move hosting; the Pages
settings UI writes that file itself when you set a custom domain.

Three things behave differently on staging than in production:

- **Both forms post to the real Formspree endpoint.** A test submission
  from the staging site lands in the real inbox alongside genuine leads.
- **The free-website form redirects off staging.** Its `_next` field is
  the absolute production URL, so a successful submit sends the visitor
  to the live site's thank-you page, not the staging one.
- **Canonical tags point at the production domain** on every page. That
  is what stops the staging copy from competing with the real site in
  search, so keep them pointing there. Note that this repo's `robots.txt`
  has no effect on a project site — crawlers only read `robots.txt` at
  the domain root (`muskoka-boost.github.io/robots.txt`), which this
  repository does not control. The canonicals are the actual protection.
