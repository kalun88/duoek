# duoek.com — Astro + Notion CMS

Simple static site for duo ék. Content is managed from Notion and built/deployed via Cloudflare Pages.

---

## ⚠️ Important: Separate from kalunleung.ca

This project uses **completely separate Notion databases** from your kalunleung.ca site.

| | kalunleung.ca | duoek.com |
|---|---|---|
| `DATABASE_ID` | ✅ Your blog/portfolio DB | ❌ Do NOT use here |
| `GIGS_DATABASE_ID` | ✅ Your personal gigs DB | ❌ Do NOT use here |
| `SETTINGS_PAGE_ID` | — | ✅ New page, duo ék only |
| `DATES_DATABASE_ID` | — | ✅ New database, duo ék only |

The only thing shared is your **`NOTION_API_SECRET`** (the integration API key) — that's just your Notion account's access token, it doesn't mix content.

---

## Notion Setup

### Step 1 — Create a Settings Page

In Notion, create a new page for duo ék site settings. Then **add page properties** (not body text):

| Property name | Type | Example value |
|---|---|---|
| Hero Title | Text | duo ék |
| Show Title | Title | Pouet! |
| Tagline | Text | trompette + trombone · 30 min · 3–9 ans |
| Booking Name | Text | Aurélie Lescafette |
| Booking Email | Email | developpement@levivier.ca |
| Booking Agency | Text | Le Vivier |
| Booking Phone | Phone | +1 514-804-4501 |
| Tech Email | Email | kalunis@gmail.com |
| Instagram | URL | https://www.instagram.com/duoek__ |
| Facebook | URL | https://www.facebook.com/duoek2 |
| YouTube | URL | https://www.youtube.com/watch?v=NPzR1SM0qMY |

Copy the page ID from the URL: `notion.so/your-workspace/[PAGE-ID]`

### Step 2 — Create a Dates Database

Create a new, empty Notion database (not in your kalunleung workspace). Add these properties:

| Property name | Type | Notes |
|---|---|---|
| Name | Title | Show name, e.g. "Pouet! — Maison de la culture" |
| Date | Date | Performance date |
| Venue | Text | Venue name |
| City | Text | e.g. Montréal |
| Tickets URL | URL | Link to ticketing page (optional) |
| Published | Checkbox | ✅ Check to show on site |

Copy the database ID from the URL: `notion.so/your-workspace/[DATABASE-ID]?v=...`

### Step 3 — Share with your Notion integration

For both the Settings Page and Dates Database, click **Share** → search for your integration name → **Invite**.

---

## Local Development

1. Clone this repo
2. Copy `.env.example` to `.env` and fill in your values:
   ```
   NOTION_API_SECRET=ntn_...  ← same key as kalunleung.ca is fine
   SETTINGS_PAGE_ID=...       ← the new page you created in Step 1
   DATES_DATABASE_ID=...      ← the new database from Step 2
   ```
3. Install and run:
   ```bash
   npm install
   npm run dev
   ```

---

## Cloudflare Pages Deployment

1. Push this folder to a new GitHub repo (e.g. `kalun88/duoek`)
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/) → Create a project → Connect to GitHub → select the repo
3. Build settings:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
4. Add Environment Variables (Settings → Environment variables):
   - `NOTION_API_SECRET`
   - `SETTINGS_PAGE_ID`
   - `DATES_DATABASE_ID`
5. Connect your custom domain: `duoek.com` → Pages → Custom domains → Add
6. In Cloudflare DNS, delete the old Worker DNS record for `duoek.com` and let Pages manage it

---

## Updating Content

- **Show dates**: Add/edit rows in your Dates database in Notion, then trigger a new deployment (or set up a webhook)
- **Hero text / contact info**: Edit the Settings Page properties in Notion
- **Trigger a rebuild**: Go to Cloudflare Pages → your project → Deployments → Retry deployment (or push any commit to GitHub)
