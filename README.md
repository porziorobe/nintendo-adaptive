# Nintendo.com above-the-fold (static demo)

Visual-only HTML/CSS recreation of the top of the Nintendo homepage, with a tiny Express server so the app runs on **Heroku**. You can track this folder inside MyVibeProject, **or** copy it elsewhere and run `git init` there if you want a dedicated GitHub repo for Heroku only.

## Run locally

```bash
cd nintendo-home-demo
npm install
npm start
```

Open `http://localhost:3000`. The server serves files from `public/`.

## Deploy with GitHub → Heroku

1. **Create a new empty repository on GitHub** (no README required).
2. From this folder:

   ```bash
   cd nintendo-home-demo
   git init
   git add .
   git commit -m "Initial static Nintendo-style demo with Heroku server"
   git branch -M main
   git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
   git push -u origin main
   ```

3. In the **Heroku Dashboard**: create an app → **Deploy** → **GitHub** → connect the repo → enable **Automatic Deploys** from `main`.
4. Confirm the **Node.js** buildpack is selected (default for `package.json` apps). Heroku runs `npm install` and starts the process defined in the `Procfile` (`web: npm start`).

The app binds to `process.env.PORT` in `server.js`, which Heroku provides automatically.

## Project layout

- `public/index.html` — Markup for header, hero, and product row.
- `public/css/styles.css` — Layout and Nintendo-style colors (`#e60012`, card grid).
- `public/images/` — Logo, hero, and tile assets (replace files as needed; update `src` and optional dimensions in HTML/CSS).
- `server.js` — Express static file server.
- `Procfile` — Heroku web process.

### Image files

| File | Role |
|------|------|
| `nintendo-logo.png` | Official-style logo in the **red brand lockup** (flush left). Swap the file to change artwork; tune `.site-header__logo` `height` / `max-width` in CSS if needed. |
| `hero-keyart.png` | Wide hero banner (2880×900). Replace to swap the main hero image; keep `width`/`height` on the `<img>` in sync. |
| `tile-mario-kart-world.svg` | Card 1 art (placeholder gradient until you replace). |
| `tile-donkey-kong.svg` | Card 2 |
| `tile-splatoon.svg` | Card 3 |
| `tile-mario-galaxy.svg` | Card 4 |
| `tile-zelda.svg` | Card 5 |

Use roughly **16:9** artwork for tiles.

## Notes

- Links and buttons are non-functional placeholders (`href="#"`).
- This is a demonstration layout only, not affiliated with Nintendo.
