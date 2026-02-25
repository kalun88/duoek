import { Client } from "@notionhq/client";

// ─── Helpers ────────────────────────────────────────────────────────────────

function env(key: string): string {
  // Works both in Vite (import.meta.env) and in plain Node (process.env)
  return (
    (typeof import.meta !== "undefined" && (import.meta.env as Record<string, string>)[key]) ||
    (typeof process !== "undefined" && process.env[key]) ||
    ""
  );
}

function getClient(): Client | null {
  const secret = env("NOTION_API_SECRET");
  if (!secret) return null;
  return new Client({ auth: secret });
}

// Extract plain text from a Notion property of various types
function text(prop: Record<string, unknown> | undefined): string {
  if (!prop) return "";
  const p = prop as Record<string, unknown>;
  if (p.type === "title" && Array.isArray(p.title))
    return (p.title as Array<{ plain_text: string }>).map((t) => t.plain_text).join("");
  if (p.type === "rich_text" && Array.isArray(p.rich_text))
    return (p.rich_text as Array<{ plain_text: string }>).map((t) => t.plain_text).join("");
  if (p.type === "url") return String(p.url ?? "");
  if (p.type === "email") return String(p.email ?? "");
  if (p.type === "phone_number") return String(p.phone_number ?? "");
  if (p.type === "select" && p.select) return String((p.select as Record<string, unknown>).name ?? "");
  if (p.type === "date" && p.date) return String((p.date as Record<string, unknown>).start ?? "");
  if (p.type === "checkbox") return p.checkbox ? "true" : "false";
  return "";
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SiteSettings {
  heroTitle: string;
  showTitle: string;
  tagline: string;
  bookingName: string;
  bookingEmail: string;
  bookingAgency: string;
  bookingPhone: string;
  techEmail: string;
  instagram: string;
  facebook: string;
  youtube: string;
}

export interface DateItem {
  id: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  ticketsUrl: string;
}

// ─── Defaults ────────────────────────────────────────────────────────────────
// Hardcoded fallback values so the site renders correctly before Notion is set up.

const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: "duo ék",
  showTitle: "Pouet!",
  tagline: "trompette + trombone · 30 min · 3–9 ans",
  bookingName: "Aurélie Lescafette",
  bookingEmail: "developpement@levivier.ca",
  bookingAgency: "Le Vivier",
  bookingPhone: "+1 514-804-4501",
  techEmail: "kalunis@gmail.com",
  instagram: "https://www.instagram.com/duoek__",
  facebook: "https://www.facebook.com/duoek2",
  youtube: "https://www.youtube.com/watch?v=NPzR1SM0qMY",
};

// ─── Fetchers ────────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings> {
  const notion = getClient();
  const pageId = env("SETTINGS_PAGE_ID");

  if (!notion || !pageId) {
    console.warn("⚠️  NOTION_API_SECRET or SETTINGS_PAGE_ID not set — using defaults.");
    return DEFAULT_SETTINGS;
  }

  try {
    const page = await notion.pages.retrieve({ page_id: pageId }) as Record<string, unknown>;
    const props = (page.properties ?? {}) as Record<string, Record<string, unknown>>;

    return {
      heroTitle:    text(props["Hero Title"])    || DEFAULT_SETTINGS.heroTitle,
      showTitle:    text(props["Show Title"])    || DEFAULT_SETTINGS.showTitle,
      tagline:      text(props["Tagline"])       || DEFAULT_SETTINGS.tagline,
      bookingName:  text(props["Booking Name"])  || DEFAULT_SETTINGS.bookingName,
      bookingEmail: text(props["Booking Email"]) || DEFAULT_SETTINGS.bookingEmail,
      bookingAgency:text(props["Booking Agency"])|| DEFAULT_SETTINGS.bookingAgency,
      bookingPhone: text(props["Booking Phone"]) || DEFAULT_SETTINGS.bookingPhone,
      techEmail:    text(props["Tech Email"])    || DEFAULT_SETTINGS.techEmail,
      instagram:    text(props["Instagram"])     || DEFAULT_SETTINGS.instagram,
      facebook:     text(props["Facebook"])      || DEFAULT_SETTINGS.facebook,
      youtube:      text(props["YouTube"])       || DEFAULT_SETTINGS.youtube,
    };
  } catch (err) {
    console.error("Notion settings error:", err);
    return DEFAULT_SETTINGS;
  }
}

export async function getDates(): Promise<DateItem[]> {
  const notion = getClient();
  const dbId = env("DATES_DATABASE_ID");

  if (!notion || !dbId) {
    console.warn("⚠️  NOTION_API_SECRET or DATES_DATABASE_ID not set — no dates shown.");
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: dbId,
      sorts: [{ property: "Date", direction: "ascending" }],
    });

    return response.results
      .filter((page) => {
        const props = ((page as Record<string, unknown>).properties ?? {}) as Record<string, Record<string, unknown>>;
        const pub = props["Published"];
        if (!pub) return true; // show if no Published property
        return text(pub) === "true";
      })
      .map((page) => {
        const props = ((page as Record<string, unknown>).properties ?? {}) as Record<string, Record<string, unknown>>;
        return {
          id: page.id,
          title:      text(props["Name"])       || text(props["Title"]) || "Show",
          date:       text(props["Date"])        || "",
          venue:      text(props["Venue"])       || "",
          city:       text(props["City"])        || "",
          ticketsUrl: text(props["Tickets URL"]) || "",
        };
      });
  } catch (err) {
    console.error("Notion dates error:", err);
    return [];
  }
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

export function formatDate(dateStr: string, locale = "fr-CA"): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString(locale, { weekday: "short", year: "numeric", month: "long", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export function isUpcoming(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr + "T23:59:59");
  return d >= new Date();
}
