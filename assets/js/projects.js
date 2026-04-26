// Images are hosted on a separate assets repo (main branch)
const ASSETS =
  "https://raw.githubusercontent.com/Pageot/WebsiteLesMinitels-assets/refs/heads/main";

export const PLACEHOLDER_SHOWREEL = "/assets/img/FutureApp_showreel.webp";

export const PROJECTS = {
  convert: {
    id: "convert",
    name: "Convert",
    icon: `${ASSETS}/Icon%20app%20Convert.png`,
    showreel: [
      `${ASSETS}/Convert_Showreel-1.jpg`,
      `${ASSETS}/Convert_Showreel-2.jpg`,
      `${ASSETS}/Convert_Showreel-3.jpg`,
      `${ASSETS}/Convert_Showreel-4.jpg`,
      `${ASSETS}/Convert_Showreel-5.jpg`,
      `${ASSETS}/Convert_Showreel-6.jpg`,
    ],
    mockup: "/assets/img/phone-mockup.svg",
    appStore: "#",
    googlePlay: "#",
    description: [
      "Convert is an all-in-one converter that works completely offline.",
      "Convert over 200 world currencies for free with accurate exchange rates.",
      "",
      "Unlock the Pro version with one-time purchase or subscription and get even more:",
      "• Unit conversions (length, weight, volume, temperature, area, speed, and more)",
      "• Precious metals: gold, silver, platinum and others",
      "• Top 200 cryptocurrencies (Bitcoin, Ethereum, and major coins)",
      "",
      "Everything works offline, no internet needed after the initial data download. Perfect for travel, daily use or when you're without signal.",
      "Designed for maximum simplicity and speed: clean interface, quick search, dark mode, and home screen widget (Pro).",
      "One app for all your conversions: currency converter, unit converter, crypto converter, gold & silver converter always available, even offline.",
      "",
      "Download Convert now and never get stuck without the right conversion again.",
    ],
    ready: true,
  },
  spellfix: {
    id: "spellfix",
    name: "SpellFix",
    showreel: ["/assets/img/SpellFix_showreel.webp"],
    ready: true,
  },
};

// Home carousel order — 6 slots, placeholders reserved for upcoming apps.
export const CAROUSEL_ITEMS = [
  { slot: 1, project: null, label: "Soon", placeholder: true },
  { slot: 2, project: null, label: "Soon", placeholder: true },
  { slot: 3, project: "convert", label: "Convert" },
  { slot: 4, project: "spellfix", label: "SpellFix" },
  { slot: 5, project: null, label: "Soon", placeholder: true },
  { slot: 6, project: null, label: "Soon", placeholder: true },
];
