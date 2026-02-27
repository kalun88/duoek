# duoek.com — Claude context file

Read this at the start of every session to get up to speed fast.

## What is this project

Static website for **Duo Ek**, a children's circus/theatre show in Quebec. Built with Astro 5 + Tailwind CSS v4, hosted on Cloudflare Pages, content driven by Notion via the `webtrotion` integration.

Live site: **https://duoek.com**
GitHub repo: **https://github.com/kalun88/duoek**
Cloudflare Pages project: `duoek-com`

## Repo location on this machine

`/sessions/sharp-kind-hamilton/mnt/webtrotion-duoek`

(The folder mounted in Cowork is `webtrotion-duoek` — make sure the sidebar says this, not `webtrotion-kalunleung`.)

## Git / GitHub

- Remote: `https://github.com/kalun88/duoek.git`
- Username: `kalun88`
- Branch: `main`
- PAT: stored locally — **do not commit the token itself here**

To push (replace `YOUR_PAT` with the current token — ask Kalun if unsure):
```bash
cd /sessions/sharp-kind-hamilton/mnt/webtrotion-duoek
git remote set-url origin https://kalun88:YOUR_PAT@github.com/kalun88/duoek.git
git push origin main
```

If push fails with "Invalid username or token", the PAT has expired — ask Kalun for a new one (github.com → Settings → Developer settings → Personal access tokens → Tokens classic, `repo` scope).

## Deploying

Cloudflare Pages auto-deploys on every push to `main`. Usually live in ~2 min.

**One-click publish link** (for Kalun to trigger a redeploy without a code change, e.g. after updating Notion content):
`https://weathered-violet-70e9duoek-publish.kalunis.workers.dev/publish/tQW81ZOqZiKa7EG91R4CqQ`

This hits a Cloudflare Worker (`weathered-violet-70e9duoek-publish`) which POSTs to the Pages deploy hook.

## Tech stack

- **Astro 5** — static site generator
- **Tailwind CSS v4** — utility CSS (config is in `astro.config.ts` / CSS, not `tailwind.config.js`)
- **Notion** — content source via webtrotion integration
- **Cloudflare Pages** — hosting
- **Cloudflare Workers** — publish webhook

## Key source files

| File | Purpose |
|------|---------|
| `src/components/Hero.astro` | Main hero section — show title, tagline, age recommendation |
| `src/components/About.astro` | About the show |
| `src/components/Dates.astro` | Upcoming show dates grid |
| `src/components/Atelier.astro` | Workshop section |
| `src/components/Contact.astro` | Contact form/info |
| `src/components/Gallery.astro` | Photo gallery |
| `src/components/Video.astro` | Video embed |
| `src/components/Funders.astro` | Funders/logos |
| `src/components/DuoEk.astro` | Root layout component |

## Show copy notes

- Age recommendation is **"2 ans et +"** (was changed from "4 ans et +" — appears in Hero.astro ×2 and About.astro ×2)
- Language: French (Quebec)
- Show name: **Pouet**

## Notion dashboard

Page ID: `31286f764edc818e9c73fd665e9f166e`
Contains one-click publish link and instructions for Kalun to update content.

## Cloudflare account

Login email: `kalunis@gmail.com`
Worker name: `weathered-violet-70e9duoek-publish`
Worker env var: `DEPLOY_HOOK_URL` = Pages deploy hook URL

## Common tasks

**Make a copy change**: Edit the relevant `.astro` file in `src/components/`, commit, push.

**Fix a layout/style issue**: Tailwind v4 — use utility classes directly. CSS variables defined in the global stylesheet. Mobile-first, use `sm:` prefix for desktop overrides.

**Trigger a redeploy after Notion content update**: Visit the publish link above, or push any commit.
