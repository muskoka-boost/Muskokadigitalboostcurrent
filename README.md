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
404.html              Error page
css/styles.css        All styling
js/main.js            All scripting
favicon.svg           Favicon
robots.txt            Points at sitemap.xml
sitemap.xml           Lists the 8 public pages
```

All 8 pages listed in `sitemap.xml` are present. Every internal link and
asset reference resolves to a file in this repo — nothing points at a
missing file.

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
- `sitemap.xml` carries `lastmod` dates — refresh them when you change a
  page.
