export interface SiteConfig {
  name: string;
  shortName: string;
  description: string;
  url: string;
  ogImage: string;
  locale: string;
  supportedCountry: "CA";
  links: {
    github?: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Canada Mosque Near Me",
  shortName: "Mosque Near Me CA",
  description:
    "Find authentic Canadian mosques, daily calculated prayer times, and mosque-verified Iqamah and Jummah schedules across Canada.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://canadamosquenearme.ca",
  ogImage: "/og.jpg",
  locale: "en_CA",
  supportedCountry: "CA",
  links: {},
};
