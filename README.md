# Rails Comedy — tribute site

A static tribute page for Rails Comedy, DC's improv and sketch comedy theater
(2021–2026), formerly at the DC Arts Center, 2438 18th St NW.

Replaces the Webflow site. No build step, no framework, no subscription.

Live at **<https://www.rails-comedy.com/>**

---

## What's here

```
index.html        the whole page
css/style.css     styles
js/main.js        nav, slideshow, lightbox, scroll reveal
img/              54 photographs + logo + favicons (all AVIF except icons)
fonts/            Anton + Plus Jakarta Sans, self-hosted (OFL)
CNAME             custom domain for GitHub Pages — do not delete
.nojekyll         tells GitHub Pages to serve files as-is
```

**Self-contained by design.** Images and fonts are hosted in this repo — no CDN,
no Google Fonts request, no Webflow assets. Double-click `index.html` and it
works offline. The one exception is the Google Analytics tag (see below); the
page still functions if Google is unreachable.

## Sections

Hero → About → Slides → What we made → Past shows → The stage → Goodbye →
Voices → Keep it going → Footer

30 show cards, a 54-slide gallery with lightbox, and six community pull quotes.

## Preview locally

```bash
python3 -m http.server 4321 --directory .
```

Then open <http://localhost:4321>.

---

# Hosting and DNS

Three services are involved. Only one of them actually serves the site.

```
railscomedy.com          rails-comedy.com            GitHub Pages
(Squarespace DNS)        (IONOS DNS)                 (walkergreen/
        |                        |                    rails-comedy-tribute)
        |  301 redirect          |  A + CNAME                |
        +----------------------->+-------------------------->+
                                                        serves the site
```

## 1. GitHub Pages — the actual hosting

| Setting | Value |
|---|---|
| Repo | `walkergreen/rails-comedy-tribute` |
| Source | branch `main`, folder `/` (root) |
| Custom domain | `www.rails-comedy.com` (from the `CNAME` file) |
| HTTPS | enforced; Let's Encrypt cert covers `www.rails-comedy.com` **and** `rails-comedy.com` |

Push to `main` and GitHub rebuilds automatically. A deploy takes roughly
30–90 seconds. HTML is served with `cache-control: max-age=600`, so a hard
refresh (`Cmd+Shift+R`) is often needed to see changes immediately.

The `CNAME` file in the repo root **is** the custom domain setting. Deleting it
unsets the domain and the site reverts to `walkergreen.github.io`.

## 2. rails-comedy.com — DNS at IONOS (this is the live domain)

Nameservers: `ns1039.ui-dns.de`, `ns1066.ui-dns.org`, `ns1073.ui-dns.biz`,
`ns1086.ui-dns.com`

| Type | Host | Value | Purpose |
|---|---|---|---|
| A | `@` | `185.199.108.153` | GitHub Pages |
| A | `@` | `185.199.109.153` | GitHub Pages |
| A | `@` | `185.199.110.153` | GitHub Pages |
| A | `@` | `185.199.111.153` | GitHub Pages |
| CNAME | `www` | `walkergreen.github.io` | GitHub Pages |
| MX | `@` | `mx00.ionos.com`, `mx01.ionos.com` | **IONOS email — do not touch** |

GitHub redirects the apex to `www` automatically because the `CNAME` file
specifies `www.rails-comedy.com`.

## 3. railscomedy.com — forwarding only, DNS at Squarespace

Nameservers: `ns-cloud-b1` through `b4.googledomains.com` (Squarespace inherited
these when it acquired Google Domains — the `googledomains.com` hostnames are
expected, not a leftover).

This domain does **not** host anything. It issues a `301` redirect to
`https://www.rails-comedy.com/` through Squarespace's forwarding, which sits
behind Cloudflare (hence `server: cloudflare` in the response headers).

| Type | Host | Value | Purpose |
|---|---|---|---|
| A | `@` | `198.202.211.1` | Squarespace forwarding endpoint |
| MX | `@` | `aspmx.l.google.com` + alts, `mxa/mxb.mailgun.org` | **Google Workspace + Mailgun — do not touch** |
| CNAME | `www` | `cdn.webflow.com` | ⚠️ stale Webflow record, see below |

### ⚠️ Email warning

Both domains carry live email and the MX records are **different on each**:

- `rails-comedy.com` → IONOS mail
- `railscomedy.com` → Google Workspace + Mailgun (this is where
  `info@railscomedy.com` and `pitch@railscomedy.com` live)

Changing `A` or `CNAME` records does not affect mail. **Deleting or editing the
`MX` records, or the SPF `TXT` record, will break email.** Leave them alone.

---

## Making railscomedy.com the primary domain

Currently `railscomedy.com` redirects *to* `rails-comedy.com`. The closing
announcement on Instagram advertised `railscomedy.com`, so that is likely the
domain people actually remember, and it matches the email addresses.

GitHub Pages allows **one** custom domain per repo — one is canonical, the other
redirects. To swap which is which, in this order (reversing it takes the site
offline):

1. **Squarespace** — remove the forwarding rule on `railscomedy.com`.
2. **Squarespace DNS** — add the four GitHub `A` records to `@`, and
   `www` → `CNAME` → `walkergreen.github.io`. Leave MX alone.
3. Wait for propagation:
   ```bash
   dig +short A railscomedy.com && dig +short www.railscomedy.com
   ```
4. Change the `CNAME` file in this repo to `www.railscomedy.com`, commit, push.
5. GitHub re-issues the certificate (up to an hour). Re-tick **Enforce HTTPS**.
6. Point `rails-comedy.com` at the same Pages site; GitHub will `301` it to the
   new canonical domain, so existing links keep working.

---

## Images — read before adding any

All photographs are AVIF, max 1800px on the long edge, encoded with `sips`.
Around 5.7 MB total for 54 photographs.

**The gotcha that broke the site once:** AVIF's `miaf` brand requires **even**
pixel dimensions. Resizing a 3:2 source by long edge alone yields 1800×1199 —
an odd height — and the encoder silently drops `miaf`. Permissive browsers still
render those files; stricter ones refuse them, so the images look fine in one
browser and are blank in another.

Always crop to even dimensions and verify the brand before committing:

```bash
# resize → even-crop → encode
sips -Z 1800 -s format png "$SRC" --out /tmp/x.png
# (round width/height down to even, then sips -c <height> <width> /tmp/x.png)
sips -s format avif -s formatOptions 60 /tmp/x.png --out img/new-photo.avif
```

Verify every file:

```bash
python3 -c "
import os, glob, subprocess
for f in sorted(glob.glob('img/*.avif')):
    head = open(f,'rb').read(40)
    o = subprocess.run(['sips','-g','pixelWidth','-g','pixelHeight',f],
                       capture_output=True).stdout.decode()
    w = int([l for l in o.split(chr(10)) if 'pixelWidth' in l][0].split(':')[1])
    h = int([l for l in o.split(chr(10)) if 'pixelHeight' in l][0].split(':')[1])
    if b'miaf' not in head or w % 2 or h % 2:
        print('BAD', f, w, h)
print('checked')
"
```

Do not use `grep miaf` on these files — grep on binary data gives false results.

## Adding a show or a slide

- **Show card** — copy an existing `<article class="show">` block in
  `index.html`, set `src`, `alt`, `width`/`height` to the real pixel size.
- **Slide** — append to the `SLIDES` array at the top of `js/main.js`.
- Bump `?v=` on the CSS/JS links in `index.html` when changing those files, so
  browsers pick up the new version rather than a cached one.

## Analytics

Google Analytics 4, measurement ID `G-6MQ95Z09YG`, in the `<head>` of
`index.html`. This is the only third-party request the page makes. Your own
visits are counted — filter them under **Admin → Data Streams → Configure tag
settings → Define internal traffic** if the numbers matter.

## Photography

All production photographs are by **Mikail Faalasli**
([@mfaalasli](https://instagram.com/mfaalasli)), credited on the page and in
the slideshow captions. Originals live in his Google Drive. Publishing rights
are his to grant.

Community pull quotes in the Voices section are from public Instagram replies
and post captions, attributed by handle.

---

## Known gaps

- **2021–2023 has no representation.** Every show and photograph on the site is
  from 2024 or later — the photo archive only goes back to September 2024. The
  hero, bio and marquee all say 2021–2026.
- **Classes** are described but have no photographs or detail.
- The stale `www.railscomedy.com` → `cdn.webflow.com` CNAME can be deleted once
  the Webflow account is closed.
- No custom 404 page; GitHub's default is served.
