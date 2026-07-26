# Rails Comedy — tribute site

A static tribute page for Rails Comedy, DC's improv and sketch comedy theater
(2021–2026), formerly at the DC Arts Center, 2438 18th St NW.

Replaces the Webflow site. No build step, no framework, no subscription.

## What's here

```
index.html      the whole page
css/style.css   styles
js/main.js      nav, slideshow, lightbox, scroll reveal
img/            logo + 9 production photos (by Mikail Faalasli)
fonts/          Anton + Plus Jakarta Sans, self-hosted (OFL)
.nojekyll       tells GitHub Pages to serve the files as-is
```

Everything is **fully self-contained** — no CDN, no Google Fonts request, no
Webflow assets. If GitHub or Google disappear tomorrow, the folder still works
when you double-click `index.html`.

## Sections

- **Hero** — Rails Comedy, 2021–2026
- **About** — what the theater was
- **Pick your play** — improv, sketch, classes, festivals
- **Now playing** — nine shows that ran at Rails
- **Slides** — auto-advancing photo slideshow with arrows, dots, swipe,
  keyboard nav, and click-to-enlarge lightbox
- **The stage** — the DCAC room
- **Footer** — Instagram, photo credit, address

## Preview locally

```bash
python3 -m http.server 4321 --directory .
```

Then open http://localhost:4321.

## Deploy to GitHub Pages (recommended — free, no upkeep)

```bash
gh repo create rails-comedy-tribute --public --source=. --push
```

Then turn Pages on:

```bash
gh api -X POST repos/:owner/rails-comedy-tribute/pages -f "source[branch]=main" -f "source[path]=/"
```

Or in the browser: **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.

The site lands at `https://<your-username>.github.io/rails-comedy-tribute/`.

### Custom domain

To keep `rails-comedy.com`, add a `CNAME` file containing `www.rails-comedy.com`,
commit it, then point DNS at GitHub:

- `www` → CNAME → `<your-username>.github.io`
- apex `@` → A records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`

Then Settings → Pages → Custom domain, and tick **Enforce HTTPS**.

## Deploy to GCP instead

Cloud Storage static hosting — a few cents a month at this size, often $0
under the free tier:

```bash
gsutil mb -l us-east1 gs://rails-comedy-tribute
gsutil -m rsync -r -x '\.git/.*' . gs://rails-comedy-tribute
gsutil web set -m index.html -e index.html gs://rails-comedy-tribute
gsutil iam ch allUsers:objectViewer gs://rails-comedy-tribute
```

HTTPS on a custom domain needs a load balancer in front of the bucket, which
is the fiddly part. **Firebase Hosting** is the easier GCP path — free tier,
HTTPS and custom domains included:

```bash
npm i -g firebase-tools
firebase login
firebase init hosting   # public directory: . — single-page app: No
firebase deploy
```

## Notes

- Photographs are by [Mikail Faalasli](https://instagram.com/mfaalasli) and are
  credited on the page. Get his sign-off before hosting them publicly if that
  hasn't already been settled.
- Fonts are Anton and Plus Jakarta Sans, both SIL Open Font License —
  redistribution with the site is fine.
- Images are AVIF (plus one JPEG), supported by all current browsers.
- To add photos, drop them in `img/` and append to the `SLIDES` array at the
  top of `js/main.js`.
