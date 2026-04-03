import type { RecommendedOffer } from "@prisma/client";

export type TemplateWebsiteFit = "NO_WEBSITE" | "HAS_WEBSITE" | "BOTH";

export type MockupVertical =
  | "BAR"
  | "RESTAURANT"
  | "CAFE"
  | "PLUMBER"
  | "ELECTRICIAN"
  | "LOCAL_SERVICES"
  | "DENTAL"
  | "FITNESS";

export type MockupKind = "gastro" | "trade" | "medical" | "wellness";

export type MockupFeature = {
  title: string;
  description: string;
  meta?: string;
};

export type MockupQuote = {
  quote: string;
  author: string;
  detail: string;
};

export type MockupVisual = {
  title: string;
  description: string;
};

export type MockupFaqItem = {
  question: string;
  answer: string;
};

export type MockupInfoRow = {
  label: string;
  value: string;
};

export type MockupHeroStat = {
  value: string;
  label: string;
};

export type MockupTheme = {
  shellBackground: string;
  browserTint: string;
  heroFrom: string;
  heroTo: string;
  heroAccent: string;
  sectionBackground: string;
  sectionMuted: string;
  cardBackground: string;
  cardMuted: string;
  borderColor: string;
  primaryText: string;
  secondaryText: string;
  accentText: string;
  accentSoft: string;
  ctaBackground: string;
  ctaText: string;
};

export type MockupGalleryMeta = {
  title: string;
  shortDescription: string;
  fitsBusiness: string;
  keyBenefit: string;
  priceBandExample: string;
  whoFor: string;
  problemSolved: string;
  style: string;
  whyItHelpsSales: string;
  proofAngle?: string;
  tags?: string[];
};

export type LocalBusinessMockup = {
  id: string;
  slug: string;
  kind: MockupKind;
  vertical: MockupVertical;
  businessName: string;
  city: string;
  offerType: RecommendedOffer;
  websiteFit: TemplateWebsiteFit;
  matchKeywords: string[];
  isGeneric?: boolean;
  gallery: MockupGalleryMeta;
  theme: MockupTheme;
  hero: {
    eyebrow: string;
    headline: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
    highlights: string[];
    stats: MockupHeroStat[];
    panelTitle: string;
    panelItems: MockupFeature[];
  };
  sections: {
    servicesTitle: string;
    servicesIntro: string;
    services: MockupFeature[];
    aboutTitle: string;
    aboutBody: string;
    aboutHighlights: string[];
    galleryTitle: string;
    galleryIntro: string;
    galleryItems: MockupVisual[];
    reviewsTitle: string;
    reviews: MockupQuote[];
    faqTitle?: string;
    faqItems?: MockupFaqItem[];
    ctaTitle: string;
    ctaBody: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    hours: MockupInfoRow[];
    reservationNote?: string;
    serviceArea?: string;
    responseTime?: string;
  };
  emergencyStrip?: {
    label: string;
    text: string;
    action: string;
  };
  footerNote: string;
};

export const MOCKUP_VERTICAL_LABELS: Record<MockupVertical, string> = {
  BAR: "Bar",
  RESTAURANT: "Restaurace",
  CAFE: "Kavárna",
  PLUMBER: "Voda-Topení-Plyn",
  ELECTRICIAN: "Elektro",
  LOCAL_SERVICES: "Lokální služby",
  DENTAL: "Zubní klinika",
  FITNESS: "Fitness / trenér",
};

export const LOCAL_BUSINESS_MOCKUPS: LocalBusinessMockup[] = [
  {
    id: "modern-cocktail-bar",
    slug: "modern-cocktail-bar",
    kind: "gastro",
    vertical: "BAR",
    businessName: "Bar U Tří světel",
    city: "Brno",
    offerType: "REDESIGN_SPRINT",
    websiteFit: "HAS_WEBSITE",
    matchKeywords: ["bar", "cocktail", "koktejl", "koktejlovy", "lounge", "vinarna", "vinoteka"],
    gallery: {
      title: "Modern cocktail bar",
      shortDescription: "Temnější gastro koncept s důrazem na atmosféru, signature nabídku a rychlou rezervaci.",
      fitsBusiness: "Koktejlové bary, wine bary, menší večerní koncepty a lounge podniky.",
      keyBenefit: "Silnější první dojem a jasnější důvod rezervovat stůl ještě dnes.",
      priceBandExample: "35 000-60 000 CZK",
      whoFor: "Podniky, které už fungují, ale web vizuálně zaostává za reálnou atmosférou podniku.",
      problemSolved: "Web nepřenáší náladu místa, nevede k rezervaci a působí zastarale.",
      style: "Tmavý, elegantní, večerní a lehce prémiový bez klubové přepjatosti.",
      whyItHelpsSales: "Dobře prodává redesign, protože rozdíl mezi současným dojmem a lepší prezentací je rychle vidět.",
      proofAngle: "Atmosféra + menu highlight + rezervace",
      tags: ["gastro", "bar", "rezervace", "atmosféra"],
    },
    theme: {
      shellBackground: "linear-gradient(180deg, #18131e 0%, #251b2f 100%)",
      browserTint: "rgba(34, 24, 45, 0.82)",
      heroFrom: "#1f1628",
      heroTo: "#3a2235",
      heroAccent: "#f1b976",
      sectionBackground: "#fff8f2",
      sectionMuted: "#f7efe7",
      cardBackground: "#fffdf9",
      cardMuted: "#2c1f2f",
      borderColor: "rgba(137, 98, 67, 0.22)",
      primaryText: "#f9f1ea",
      secondaryText: "rgba(249, 241, 234, 0.78)",
      accentText: "#3a2235",
      accentSoft: "#fde0ba",
      ctaBackground: "#f1b976",
      ctaText: "#251b2f",
    },
    hero: {
      eyebrow: "Večerní podnik s charakterem",
      headline: "Koktejlový web, který prodá atmosféru ještě před první objednávkou.",
      body: "Koncept ukazuje, jak může bar působit současně, přehledně a bez zbytečné přeplácanosti. Návštěvník hned vidí signature drinky, otevírací dobu a cestu k rezervaci.",
      primaryCta: "Rezervovat stůl",
      secondaryCta: "Zobrazit signature menu",
      highlights: ["Rezervace do 30 vteřin", "Silný první dojem", "Jasná poloha a otevírací doba"],
      stats: [
        { value: "6", label: "signature drinků v hero výběru" },
        { value: "2 kliky", label: "k rezervaci nebo kontaktu" },
        { value: "1 večer", label: "který web lépe naladí" },
      ],
      panelTitle: "Večerní highlighty",
      panelItems: [
        { title: "Signature menu", description: "Krátký výběr koktejlů s cenou a charakterem.", meta: "Koktejly / aperitivy / nealko twist" },
        { title: "Rezervace", description: "Viditelná CTA pro stůl, firemní večer nebo degustační event.", meta: "Telefon + formulář + otevírací doba" },
        { title: "Atmosféra místa", description: "Fotky interiéru, baru a večerního světla bez stock dojmu.", meta: "Bar / lounge / terasa" },
      ],
    },
    sections: {
      servicesTitle: "Co host vidí hned",
      servicesIntro: "Místo dlouhého webu dostane rychlou orientaci v nabídce, náladě a důvodu dorazit.",
      services: [
        { title: "Signature drinky", description: "Krátký výběr tří až šesti koktejlů s výraznou prezentací a cenou.", meta: "Nezahlcuje, ale probouzí chuť přijít." },
        { title: "Rezervace a eventy", description: "Jedno místo pro stůl, narozeniny i menší firemní večery.", meta: "Silné CTA v hero i footeru." },
        { title: "Lokální důvod přijít", description: "Adresa, mapa, otevírací doba a vibe podniku bez složitého hledání.", meta: "Užitečné hlavně na mobilu." },
      ],
      aboutTitle: "Pro koho tenhle styl funguje",
      aboutBody: "Pro bary, které nechtějí působit jako velký klub ani jako obyčejný jídelní web. Důležité je emoce místa, stručnost a dobrá použitelnost na mobilu.",
      aboutHighlights: ["Tmavší vizuál bez laciného luxusu", "Silná práce s typografií a světlem", "Rezervace i menu dostupné hned nahoře"],
      galleryTitle: "Jak vypadá proof vrstva",
      galleryIntro: "Náhledy pracují s interiérem, světlem a drobnými situacemi, které prodávají atmosféru podniku.",
      galleryItems: [
        { title: "Barový pult večer", description: "Široký úvodní záběr s lahvemi, světlem a dominantním CTA." },
        { title: "Detail signature drinku", description: "Detail jedné položky s krátkým popisem a cenou." },
        { title: "Rezervační moment", description: "Ukázka rychlé cesty k rezervaci bez rušivých kroků." },
      ],
      reviewsTitle: "Důvěra bez přehánění",
      reviews: [
        { quote: "Přesně víte, co čekat, a rezervace je otázka chvilky.", author: "Anna H.", detail: "večerní návštěva s přáteli" },
        { quote: "Web působí stejně dobře jako podnik samotný. To bývá u menších barů vzácné.", author: "Jakub R.", detail: "pravidelný host" },
        { quote: "Menu je krátké, přehledné a člověk se v něm neztratí ani na mobilu.", author: "Tereza M.", detail: "návštěva po práci" },
      ],
      faqTitle: "Časté dotazy hostů",
      faqItems: [
        { question: "Je rezervace nutná i ve všední dny?", answer: "Ve webovém konceptu je rezervace zvýrazněná hlavně pro pátek, sobotu a tematické večery, ale funguje i pro běžné návštěvy." },
        { question: "Musí být na webu celé menu?", answer: "Ne. Pro prodej atmosféry často stačí výběr signature drinků a jasná cesta na kompletní menu nebo sociální sítě." },
      ],
      ctaTitle: "Bar nemusí mít velký web. Stačí web, který správně naladí a dovede k rezervaci.",
      ctaBody: "Tahle maketa funguje jako prodejní proof pro redesign nebo stylový one-pager s důrazem na rezervaci a první dojem.",
      ctaPrimary: "Chci ukázat podobný koncept",
      ctaSecondary: "Otevřít mockup v plné velikosti",
    },
    contact: {
      phone: "+420 603 241 188",
      email: "rezervace@utriskel.cz",
      address: "Husova 18, 602 00 Brno",
      reservationNote: "Rezervace držíme 15 minut po potvrzeném čase.",
      hours: [
        { label: "Po-Čt", value: "17:00-00:00" },
        { label: "Pá-SO", value: "17:00-02:00" },
        { label: "Ne", value: "zavřeno" },
      ],
    },
    footerNote: "Ukázkový sales mockup pro koktejlový bar. Nejde o skutečný podnik ani produkční web.",
  },
  {
    id: "family-restaurant",
    slug: "family-restaurant",
    kind: "gastro",
    vertical: "RESTAURANT",
    businessName: "Restaurace Na Dvoře",
    city: "Olomouc",
    offerType: "SIMPLE_WEBSITE",
    websiteFit: "BOTH",
    matchKeywords: ["restaurace", "bistro", "jidlo", "obed", "vecere", "pizzerie", "gril", "steak", "brunch"],
    gallery: {
      title: "Family restaurant",
      shortDescription: "Teplý rodinný gastro koncept s důrazem na menu, rezervace a důvěru pro první návštěvu.",
      fitsBusiness: "Rodinné restaurace, bistra, denní podniky a menší podniky s poledním menu.",
      keyBenefit: "Lidé rychle najdou menu, rezervaci, dětský koutek i praktické informace.",
      priceBandExample: "22 000-38 000 CZK",
      whoFor: "Podniky, které potřebují modernější web než jen jídelní lístek v PDF nebo zastaralou microsite.",
      problemSolved: "Host hledá menu, otevírací dobu a rezervaci, ale na starém webu nebo sociálních sítích se ztrácí.",
      style: "Teplý, rodinný, přívětivý a dobře čitelný.",
      whyItHelpsSales: "Je to lehce pochopitelný webový upgrade pro podnik, který potřebuje pořádek a důvěru, ne velkou digitální transformaci.",
      proofAngle: "Menu + rezervace + praktické informace",
      tags: ["gastro", "restaurace", "menu", "rodinný podnik"],
    },
    theme: {
      shellBackground: "linear-gradient(180deg, #f7efe4 0%, #eadfcd 100%)",
      browserTint: "rgba(118, 76, 33, 0.18)",
      heroFrom: "#fff6e8",
      heroTo: "#f2d8ba",
      heroAccent: "#b65d36",
      sectionBackground: "#fffdf9",
      sectionMuted: "#f8f0e6",
      cardBackground: "#ffffff",
      cardMuted: "#f6ede4",
      borderColor: "rgba(151, 100, 59, 0.18)",
      primaryText: "#2f241c",
      secondaryText: "rgba(47, 36, 28, 0.76)",
      accentText: "#7b3f24",
      accentSoft: "#ffe1c8",
      ctaBackground: "#b65d36",
      ctaText: "#fffaf5",
    },
    hero: {
      eyebrow: "Rodinné místo pro oběd i večeři",
      headline: "Web restaurace, kde host najde menu, rezervaci i důvod zastavit se cestou domů.",
      body: "Tenhle koncept staví na přehlednosti a teplém dojmu. Funguje pro podniky, které chtějí vypadat současně, ale pořád lidsky a bez přepáleného designu.",
      primaryCta: "Rezervovat stůl",
      secondaryCta: "Zobrazit polední menu",
      highlights: ["Denní menu na prvním kliknutí", "Rodinný tón bez chaosu", "Silné mobilní použití"],
      stats: [
        { value: "3", label: "hlavní důvody návštěvy v prvním screenu" },
        { value: "1", label: "jasná cesta k rezervaci" },
        { value: "7", label: "dní otevřeno v přehledném bloku" },
      ],
      panelTitle: "Co web prodává",
      panelItems: [
        { title: "Polední menu", description: "Denní nabídka, která je vidět bez hledání a bez PDF.", meta: "Obědy / víkend / sezónní nabídka" },
        { title: "Rodinná návštěva", description: "Důraz na dětský koutek, parkování a snadnou rezervaci.", meta: "Praktické informace na jednom místě" },
        { title: "Večerní posezení", description: "Atmosféra, fotografie jídla a důvod vrátit se i mimo obědy.", meta: "Přehledné menu a kontakt" },
      ],
    },
    sections: {
      servicesTitle: "Co dává smysl ukázat hned",
      servicesIntro: "Rodinná restaurace nepotřebuje digitální efekty. Potřebuje jasnou nabídku, důvěru a snadný další krok.",
      services: [
        { title: "Polední menu bez tření", description: "Denní nabídka přímo na webu, ne jako obrázek nebo PDF.", meta: "Rychlé načtení i na mobilu" },
        { title: "Rezervace a oslavy", description: "Viditelné CTA pro běžnou rezervaci i menší rodinné akce.", meta: "Telefon, formulář, přehled kapacity" },
        { title: "Praktické info", description: "Adresa, parkování, otevírací doba a dětský koutek.", meta: "To hosté opravdu řeší" },
      ],
      aboutTitle: "Proč tenhle koncept funguje",
      aboutBody: "Podnik působí čistěji, srozumitelněji a důvěryhodněji. Hosté nemusí lovit informace po sociálních sítích a rozhodnutí k návštěvě je rychlejší.",
      aboutHighlights: ["Přívětivý tón pro rodiny i běžné hosty", "Silný důraz na menu a rezervace", "Méně chaosu, více jasných informací"],
      galleryTitle: "Ukázka vizuálů a sekcí",
      galleryIntro: "Mockup pracuje s detaily interiéru, talířem dne a krátkým blokem s důvěrou a lokalitou.",
      galleryItems: [
        { title: "Polední talíř dne", description: "Velká fotka s popisem dnešní nabídky a cenou." },
        { title: "Rodinný kout a terasa", description: "Sekce pro praktické důvody návštěvy a pohodovou atmosféru." },
        { title: "Rezervační blok", description: "Kontakt, otevírací doba a možnost zavolat nebo napsat." },
      ],
      reviewsTitle: "Důvěryhodně a bez hype",
      reviews: [
        { quote: "Líbí se mi, že na webu hned vidím polední menu i dětský koutek.", author: "Lucie K.", detail: "rodinný oběd v týdnu" },
        { quote: "Všechny důležité informace na jednom místě. Nemusím nic dohledávat.", author: "Petr S.", detail: "rezervace na večeři" },
        { quote: "Působí to útulně a člověk ví, co čekat ještě před první návštěvou.", author: "Michaela T.", detail: "víkendová návštěva" },
      ],
      faqTitle: "Na co se hosté ptají",
      faqItems: [
        { question: "Je lepší ukazovat celé menu, nebo jen výběr?", answer: "U rodinné restaurace obvykle funguje kombinace: denní menu, pár podpisových jídel a odkaz na kompletní nabídku." },
        { question: "Má být rezervace nahoře i dole?", answer: "Ano. U podniků, kde je návštěva často impulzivní, je lepší dát CTA hned do hero i do závěrečné sekce." },
      ],
      ctaTitle: "Praktický web pro restauraci, která chce působit současně a bez zmatku.",
      ctaBody: "Tenhle mockup je vhodný pro Launch Page nebo Simple Website podle rozsahu menu a potřeb rezervací.",
      ctaPrimary: "Ukázat podobný koncept",
      ctaSecondary: "Zobrazit layout detailně",
    },
    contact: {
      phone: "+420 604 115 920",
      email: "info@nadvore.cz",
      address: "tř. Svobody 42, 779 00 Olomouc",
      reservationNote: "Rezervace pro 6 a více osob potvrzujeme telefonicky.",
      hours: [
        { label: "Po-Pá", value: "10:30-22:00" },
        { label: "So", value: "11:30-22:30" },
        { label: "Ne", value: "11:30-20:00" },
      ],
    },
    footerNote: "Ukázkový sales mockup pro rodinnou restauraci. Nejde o skutečný podnik ani produkční web.",
  },
  {
    id: "cozy-cafe",
    slug: "cozy-cafe",
    kind: "gastro",
    vertical: "CAFE",
    businessName: "Kavárna Pod Pergolou",
    city: "Pardubice",
    offerType: "LAUNCH_PAGE",
    websiteFit: "BOTH",
    matchKeywords: ["kavarna", "cafe", "kava", "espresso", "brunch", "prazi", "praziarna", "pekarn"],
    gallery: {
      title: "Cozy cafe",
      shortDescription: "Lehký kavárenský koncept s důrazem na denní nabídku, brunch a klidný první dojem.",
      fitsBusiness: "Kavárny, pražírny, menší brunch concepty a podniky s výběrovou kávou.",
      keyBenefit: "Web působí útulně, přehledně a rychle vysvětlí, proč se stavit na kávu nebo brunch.",
      priceBandExample: "12 000-24 000 CZK",
      whoFor: "Podniky bez webu nebo s velmi slabou prezentací, které potřebují rychlý, ale důvěryhodný základ.",
      problemSolved: "Host neví, co kavárna nabízí, kdy má otevřeno a jestli stojí za zastávku.",
      style: "Světlý, jemný, čistý a civilní.",
      whyItHelpsSales: "Prodává rychlý one-page nebo jednoduchý web bez složitého vysvětlování rozsahu.",
      proofAngle: "Denní nabídka + brunch + lokální atmosféra",
      tags: ["gastro", "kavárna", "brunch", "výběrová káva"],
    },
    theme: {
      shellBackground: "linear-gradient(180deg, #f6f1ea 0%, #ebe1d3 100%)",
      browserTint: "rgba(126, 92, 46, 0.14)",
      heroFrom: "#fffdf8",
      heroTo: "#f2e7d4",
      heroAccent: "#6f5c3d",
      sectionBackground: "#fffdfa",
      sectionMuted: "#f7f0e6",
      cardBackground: "#ffffff",
      cardMuted: "#f5eee5",
      borderColor: "rgba(133, 104, 66, 0.14)",
      primaryText: "#3a2f26",
      secondaryText: "rgba(58, 47, 38, 0.76)",
      accentText: "#6f5c3d",
      accentSoft: "#efe2cc",
      ctaBackground: "#6f5c3d",
      ctaText: "#fffdfa",
    },
    hero: {
      eyebrow: "Místo na ranní kávu i klidný brunch",
      headline: "Jednoduchý kavárenský web, který působí útulně a nepřetěžuje.",
      body: "Pro menší kavárny často stačí čistý a dobře čitelný web. Tenhle mockup ukazuje, jak spojit denní nabídku, atmosféru a základní informace do jedné silné stránky.",
      primaryCta: "Zobrazit dnešní nabídku",
      secondaryCta: "Najít cestu do kavárny",
      highlights: ["Lehký one-page koncept", "Výběrová káva + brunch", "Silný mobilní první dojem"],
      stats: [
        { value: "1 stránka", label: "která zvládne nabídku i kontakt" },
        { value: "3 bloky", label: "pro kávu, brunch a atmosféru" },
        { value: "0 chaosu", label: "pro hosta na mobilu" },
      ],
      panelTitle: "Na co web láká",
      panelItems: [
        { title: "Dnešní sladké", description: "Krátký denní highlight s fotkou a cenou.", meta: "Koláče / tartaletka / cheesecake" },
        { title: "Brunch blok", description: "Sekce pro víkendovou nabídku a rezervaci menšího stolu.", meta: "Sobota a neděle" },
        { title: "Cesta do kavárny", description: "Mapa, otevírací doba a jednoduchý kontakt.", meta: "MHD / pěší dostupnost" },
      ],
    },
    sections: {
      servicesTitle: "Co dává kavárně smysl ukázat",
      servicesIntro: "Ne velké menu. Spíš chuť zastavit se, krátkou nabídku a snadný další krok.",
      services: [
        { title: "Denní nabídka", description: "Jednoduchý blok pro koláč dne, batch brew nebo víkendový brunch.", meta: "Aktualizace bez velké námahy" },
        { title: "Atmosféra místa", description: "Pár silných fotek interiéru a detailů, které prodají klid i charakter.", meta: "Bez potřeby velké galerie" },
        { title: "Praktické info", description: "Adresa, otevírací doba, wifi a kontakt na jednom místě.", meta: "Přesně to host potřebuje" },
      ],
      aboutTitle: "Proč je tenhle formát pro kavárnu praktický",
      aboutBody: "Menší kavárna často nepotřebuje složitý web. Potřebuje dobře fungující stránku, která působí důvěryhodněji než jen sociální sítě a umí návštěvníka rychle orientovat.",
      aboutHighlights: ["Výborný základ pro Launch Page", "Jednoduché, ale stále estetické", "Dobře se rozšiřuje později o menu nebo rezervace"],
      galleryTitle: "Jak vypadá proof pro kavárnu",
      galleryIntro: "Maketa kombinuje lehké fotografie, denní highlighty a čisté informační bloky.",
      galleryItems: [
        { title: "Bar s batch brew", description: "Úvodní vizuál s ranním světlem a jednoduchým CTA." },
        { title: "Brunch víkend", description: "Sekce s víkendovým menu a termíny." },
        { title: "Klidný interiér", description: "Ukázka detailů, sezení a lokální atmosféry." },
      ],
      reviewsTitle: "Lehká důvěra a sociální proof",
      reviews: [
        { quote: "Na webu hned vidím, jestli dnes mají brunch nebo jen sladké.", author: "Karolína B.", detail: "pravidelná návštěvnice" },
        { quote: "Je to přesně ten typ webu, který nepůsobí sterilně ani přeplácaně.", author: "Martin J.", detail: "návštěva po práci" },
        { quote: "Líbí se mi, že adresa a otevírací doba jsou jasné na první pohled.", author: "Nikola P.", detail: "víkendový brunch" },
      ],
      faqTitle: "Časté otázky pro menší kavárny",
      faqItems: [
        { question: "Stačí kavárně jedna stránka?", answer: "Ve spoustě případů ano. Pokud jde hlavně o důvěryhodný základ, denní nabídku a kontakt, Launch Page bývá plně dostačující." },
        { question: "Je potřeba velká galerie?", answer: "Ne. Pro kavárnu obvykle lépe funguje několik silných vizuálů a krátké, praktické bloky." },
      ],
      ctaTitle: "Kavárenský web, který se dá rychle prodat i rychle nasadit.",
      ctaBody: "Tenhle koncept je vhodný jako Launch Page nebo jednoduchý web pro podnik, který chce působit klidněji a profesionálněji.",
      ctaPrimary: "Ukázat koncept klientovi",
      ctaSecondary: "Otevřít mockup detailně",
    },
    contact: {
      phone: "+420 601 984 223",
      email: "ahoj@podpergolou.cz",
      address: "Smilova 9, 530 02 Pardubice",
      reservationNote: "Pro větší brunch stůl stačí krátce zavolat nebo napsat.",
      hours: [
        { label: "Po-Pá", value: "07:30-18:00" },
        { label: "So", value: "08:30-18:00" },
        { label: "Ne", value: "08:30-16:00" },
      ],
    },
    footerNote: "Ukázkový sales mockup pro kavárnu. Nejde o skutečný podnik ani produkční web.",
  },
  {
    id: "plumber-voda-topeni-plyn",
    slug: "plumber-voda-topeni-plyn",
    kind: "trade",
    vertical: "PLUMBER",
    businessName: "VTP Novák Brno",
    city: "Brno",
    offerType: "LAUNCH_PAGE",
    websiteFit: "NO_WEBSITE",
    matchKeywords: ["instalater", "voda", "topeni", "plyn", "havarie", "kotel", "odpady", "kanalizace", "topenar"],
    gallery: {
      title: "Plumber / voda-topění-plyn",
      shortDescription: "Přímý řemeslný koncept s telefonem nahoře, havarijní linkou a jasnými službami.",
      fitsBusiness: "Instalatéři, topenáři, voda-topění-plyn, drobné havarijní a servisní firmy.",
      keyBenefit: "Web rychle sbírá telefonáty a poptávky bez zbytečného vysvětlování.",
      priceBandExample: "9 000-16 000 CZK",
      whoFor: "Řemeslné firmy bez webu nebo jen s firemním profilem a nejasným kontaktem.",
      problemSolved: "Zákazník potřebuje rychle zavolat, ale nemá důvěryhodný web s jasným rozsahem služeb.",
      style: "Přímý, čistý, důvěryhodný a zaměřený na kontakt.",
      whyItHelpsSales: "Prodává nejrychlejší cash-first nabídku: vlastní webový základ s telefonem, službami a lokalitou.",
      proofAngle: "Telefon + služba + servisní oblast",
      tags: ["řemeslo", "instalatér", "VTP", "havarie"],
    },
    theme: {
      shellBackground: "linear-gradient(180deg, #e8f4ff 0%, #d8e8f6 100%)",
      browserTint: "rgba(18, 95, 160, 0.16)",
      heroFrom: "#ffffff",
      heroTo: "#dff1ff",
      heroAccent: "#0b75c9",
      sectionBackground: "#fcfeff",
      sectionMuted: "#eef7ff",
      cardBackground: "#ffffff",
      cardMuted: "#f1f8ff",
      borderColor: "rgba(17, 98, 164, 0.16)",
      primaryText: "#173048",
      secondaryText: "rgba(23, 48, 72, 0.76)",
      accentText: "#0b75c9",
      accentSoft: "#d7edff",
      ctaBackground: "#0b75c9",
      ctaText: "#ffffff",
    },
    hero: {
      eyebrow: "Voda, topení, plyn bez zbytečného čekání",
      headline: "Řemeslný web, který vede rovnou k telefonu a působí důvěryhodně i bez velkého rozpočtu.",
      body: "Tenhle mockup staví na tom, co zákazník opravdu potřebuje: rychlý kontakt, jasný rozsah prací, servisní oblast a signály, že jde o spolehlivého lokálního řemeslníka.",
      primaryCta: "Zavolat hned",
      secondaryCta: "Poslat krátkou poptávku",
      highlights: ["Telefon v hero", "Jasné služby i lokalita", "Vhodné pro no-website leady"],
      stats: [
        { value: "1 klik", label: "na zavolání z mobilu" },
        { value: "3 bloky", label: "které vysvětlí služby" },
        { value: "24/7", label: "havarijní rámec pro urgentní práce" },
      ],
      panelTitle: "Co zákazník vidí hned",
      panelItems: [
        { title: "Havarijní výjezdy", description: "Viditelná informace pro únik vody, topení nebo plyn.", meta: "Brno a okolí" },
        { title: "Běžné montáže", description: "Bojlery, rozvody, kotle, baterie a drobné opravy.", meta: "Domácnosti i menší firmy" },
        { title: "Kontakt bez složitostí", description: "Telefon, krátký formulář a jasná dostupnost.", meta: "Ráno, večer i víkend" },
      ],
    },
    sections: {
      servicesTitle: "Jak vypadá dobrý prodejní základ pro řemeslo",
      servicesIntro: "Nejde o velký web. Jde o to, aby člověk rychle pochopil, co děláte, kde jezdíte a jak vás zastihnout.",
      services: [
        { title: "Havarijní zásah", description: "Výrazný blok pro akutní situace s telefonním CTA.", meta: "Únik vody, topení, zápach plynu" },
        { title: "Montáže a opravy", description: "Přehled základních prací bez odborného chaosu.", meta: "Kotle, radiátory, odpady, baterie" },
        { title: "Servisní oblast", description: "Brno a blízké okolí přehledně na jednom místě.", meta: "Důvěra pro lokální poptávku" },
      ],
      aboutTitle: "Proč tenhle typ webu funguje",
      aboutBody: "U řemeslných leadů jde hlavně o důvěryhodný první dojem, telefon v prvním screenu a přehled služeb. To je přesně to, co malý web může dodat rychle a bez velkého projektu.",
      aboutHighlights: ["Silný telefonický CTA", "Praktické bloky místo marketingových frází", "Vhodné pro rychlý Launch Page prodej"],
      galleryTitle: "Jak může vypadat proof pro trades",
      galleryIntro: "Ukázka pracuje s čistými ikonami, výjezdovou zónou, referencemi a jasnou strukturou služeb.",
      galleryItems: [
        { title: "Havarijní horní pás", description: "Okamžitá telefonní linka pro akutní zásahy." },
        { title: "Přehled služeb", description: "Kotle, odpady, rozvody a opravy v čisté mřížce." },
        { title: "Reference a lokalita", description: "Ukázka realizací a měst, kam firma vyjíždí." },
      ],
      reviewsTitle: "Důvěra pro lokální zakázku",
      reviews: [
        { quote: "Na webu je hned vidět, že dělají přesně to, co jsme potřebovali.", author: "Jitka V.", detail: "oprava topení v rodinném domě" },
        { quote: "Telefon nahoře je přesně to, co u podobné služby člověk ocení.", author: "Roman D.", detail: "akutní výměna ventilu" },
        { quote: "Přehledný web bez omáčky. Hned víte, jestli vám umí pomoct.", author: "Pavel M.", detail: "rekonstrukce koupelny" },
      ],
      faqTitle: "Otázky, které se u trades leadů objevují",
      faqItems: [
        { question: "Má smysl dávat formulář, když většina lidí chce volat?", answer: "Ano, ale jako sekundární cestu. Hlavní CTA zůstává telefon, formulář pomáhá mimo pracovní dobu nebo pro méně urgentní poptávky." },
        { question: "Musí být web rozsáhlý?", answer: "Ne. U těchto firem často funguje lépe stručný a důvěryhodný základ než složitý web s desítkami podstránek." },
      ],
      ctaTitle: "Přímý web pro řemeslníka, který potřebuje hlavně telefon a důvěru.",
      ctaBody: "Mockup je postavený jako rychlý sales asset pro Launch Page. Dá se ale rozšířit i na jednoduchý víceblokový web.",
      ctaPrimary: "Ukázat trades proof",
      ctaSecondary: "Otevřít full mockup",
    },
    contact: {
      phone: "+420 605 336 118",
      email: "servis@vtpnovak.cz",
      address: "Jamborova 63, 615 00 Brno",
      serviceArea: "Brno, Modřice, Šlapanice, Kuřim a okolí",
      responseTime: "Běžné výjezdy do 24 hodin, havárie podle dostupnosti.",
      hours: [
        { label: "Po-Pá", value: "07:00-18:00" },
        { label: "So", value: "08:00-14:00" },
        { label: "Ne", value: "havarijní telefon" },
      ],
    },
    emergencyStrip: {
      label: "Havarijní výjezd",
      text: "Únik vody, netěsnost topení nebo problém s plynem řešte rovnou telefonem.",
      action: "Volat servis",
    },
    footerNote: "Ukázkový sales mockup pro voda-topění-plyn. Nejde o skutečnou firmu ani produkční web.",
  },
  {
    id: "electrician-trust",
    slug: "electrician-trust",
    kind: "trade",
    vertical: "ELECTRICIAN",
    businessName: "Elektro Havel",
    city: "Plzeň",
    offerType: "SIMPLE_WEBSITE",
    websiteFit: "BOTH",
    matchKeywords: ["elektrikar", "elektro", "revize", "rozvody", "jistice", "fotovoltaika", "osvetleni", "nabijecka"],
    gallery: {
      title: "Electrician",
      shortDescription: "Čistý elektro koncept s důrazem na důvěru, revize, rozvody a rychlý první kontakt.",
      fitsBusiness: "Elektrikáři, menší elektro firmy, revizní technici a firmy pro rozvody nebo modernizace.",
      keyBenefit: "Pomáhá vysvětlit služby odborně, ale pořád lidsky a srozumitelně.",
      priceBandExample: "18 000-32 000 CZK",
      whoFor: "Firmy, které chtějí působit důvěryhodněji než jen přes katalog nebo starý web.",
      problemSolved: "Zákazník potřebuje rozumět službám, rozsahu a důvěře, ale současný web to neumí podat jasně.",
      style: "Čistý, technický, přehledný a klidně profesionální.",
      whyItHelpsSales: "Je vhodný pro Simple Website nebo lehčí redesign, hlavně tam, kde rozhoduje důvěra a jasnost.",
      proofAngle: "Důvěra + služby + odborná srozumitelnost",
      tags: ["elektro", "revize", "rozvody", "lokální služby"],
    },
    theme: {
      shellBackground: "linear-gradient(180deg, #f5f7fb 0%, #e6ebf3 100%)",
      browserTint: "rgba(46, 63, 91, 0.14)",
      heroFrom: "#0f1726",
      heroTo: "#1d2f45",
      heroAccent: "#ffd669",
      sectionBackground: "#ffffff",
      sectionMuted: "#f3f6fb",
      cardBackground: "#ffffff",
      cardMuted: "#f5f7fb",
      borderColor: "rgba(49, 72, 102, 0.14)",
      primaryText: "#f4f8ff",
      secondaryText: "rgba(244, 248, 255, 0.78)",
      accentText: "#21476f",
      accentSoft: "#fff1c2",
      ctaBackground: "#ffd669",
      ctaText: "#18283d",
    },
    hero: {
      eyebrow: "Rozvody, revize a modernizace elektro",
      headline: "Elektro web, který působí odborně, ale pořád srozumitelně pro běžného zákazníka.",
      body: "U elektro služeb rozhoduje důvěra, přehlednost a jistota, že firma ví, co dělá. Tenhle mockup to řeší bez technického chaosu a bez těžkopádného webu.",
      primaryCta: "Domluvit konzultaci",
      secondaryCta: "Zavolat technikovi",
      highlights: ["Důvěra pro domácnosti i menší firmy", "Jasné rozdělení služeb", "Přehled revizí a kontaktu"],
      stats: [
        { value: "4", label: "typy zakázek vysvětlené bez balastu" },
        { value: "1", label: "sekce pro revize a konzultace" },
        { value: "100 %", label: "důraz na čitelnost a důvěru" },
      ],
      panelTitle: "Jak je web poskládaný",
      panelItems: [
        { title: "Rozvody a rekonstrukce", description: "Domácnosti, menší provozy i částečné modernizace.", meta: "Byty / domy / provozovny" },
        { title: "Revize a kontroly", description: "Jasný blok pro pravidelné i předprodejní revize.", meta: "Revize / zprávy / termíny" },
        { title: "Silný kontakt", description: "Telefon, email a krátká konzultace bez složitého formuláře.", meta: "Rychlá reakce a domluva" },
      ],
    },
    sections: {
      servicesTitle: "Co elektro firmy potřebují ukázat",
      servicesIntro: "Ne jen výčet všeho. Spíš strukturu, která rychle vysvětlí typy prací a usnadní kontakt.",
      services: [
        { title: "Rozvody a rekonstrukce", description: "Přehled, pro koho jsou práce vhodné a co zahrnují.", meta: "Byty, domy, menší komerční prostory" },
        { title: "Revize a bezpečnost", description: "Samostatný blok pro revize, pravidelné kontroly a dokumentaci.", meta: "Důvěra pro nové klienty" },
        { title: "Poradenství a servis", description: "Krátká konzultace, zásahy a drobné úpravy podle potřeby.", meta: "Telefon nebo poptávka" },
      ],
      aboutTitle: "Proč elektro koncept potřebuje jinou náladu než instalatér",
      aboutBody: "Tady prodává spíš klid, profesionalita a jasná struktura než urgentnost. Proto je layout techničtější, čistší a méně expresivní.",
      aboutHighlights: ["Větší důraz na důvěru než na havarijní framing", "Čitelná struktura pro služby i revize", "Vhodné pro Simple Website i lehčí redesign"],
      galleryTitle: "Proof bloky pro elektro",
      galleryIntro: "Maketa ukazuje rozdělení služeb, reference z realizací a stručný revizní blok.",
      galleryItems: [
        { title: "Technický hero", description: "Úvod se silným kontrastem a jasnou konzultací." },
        { title: "Reference z realizací", description: "Fotografie rozvaděče, osvětlení a čisté montáže." },
        { title: "Revizní sekce", description: "Blok, který zjednoduší jinak technické téma." },
      ],
      reviewsTitle: "Důvěra bez přestřelených slibů",
      reviews: [
        { quote: "Na webu je konečně jasně vidět, co dělají a jak se s nimi domluvit.", author: "Milan V.", detail: "rekonstrukce bytu" },
        { quote: "Působí to odborně, ale není to napsané jen pro elektrikáře.", author: "Irena H.", detail: "revize rodinného domu" },
        { quote: "Líbí se mi klidný tón a jasné rozdělení služeb.", author: "Tomáš D.", detail: "menší provozovna" },
      ],
      faqTitle: "Časté otázky u elektro webů",
      faqItems: [
        { question: "Má být na webu hodně technických detailů?", answer: "Spíš jen tolik, aby zákazník pochopil rozsah a důvěřoval. Přehnaně odborný text často kontakt spíš zpomalí." },
        { question: "Je vhodnější Launch Page, nebo Simple Website?", answer: "U elektro firem často dává větší smysl Simple Website, protože služby a revize si říkají o trochu víc prostoru než čistě havarijní trades lead." },
      ],
      ctaTitle: "Technicky čistý proof pro elektro služby, které chtějí působit důvěryhodněji.",
      ctaBody: "Tento mockup je vhodný hlavně pro Simple Website a lehčí redesign pro firmy, které už mají reference a potřebují je lépe odprezentovat.",
      ctaPrimary: "Ukázat elektro variantu",
      ctaSecondary: "Otevřít full mockup",
    },
    contact: {
      phone: "+420 606 447 311",
      email: "info@elektrohavel.cz",
      address: "Smetanovy sady 14, 301 00 Plzeň",
      serviceArea: "Plzeň, Starý Plzenec, Třemošná a okolí",
      responseTime: "Konzultace a běžné poptávky obvykle do dalšího pracovního dne.",
      hours: [
        { label: "Po-Pá", value: "08:00-17:30" },
        { label: "So", value: "po dohodě" },
        { label: "Ne", value: "zavřeno" },
      ],
    },
    footerNote: "Ukázkový sales mockup pro elektro služby. Nejde o skutečnou firmu ani produkční web.",
  },
  {
    id: "general-local-craftsman",
    slug: "general-local-craftsman",
    kind: "trade",
    vertical: "LOCAL_SERVICES",
    businessName: "Domácí servis Šimek",
    city: "Hradec Králové",
    offerType: "LAUNCH_PAGE",
    websiteFit: "BOTH",
    matchKeywords: ["hodinovy manzel", "remeslnik", "domaci sluzby", "opravy", "servis", "udrzba", "montaze", "drobne prace"],
    isGeneric: true,
    gallery: {
      title: "General local craftsman",
      shortDescription: "Univerzální lokální-service koncept s telefonem, službami a přehledným důvodem zavolat.",
      fitsBusiness: "Hodinový manžel, domácí servis, montáže, drobné opravy a obecné lokální služby.",
      keyBenefit: "Dobře funguje jako obecný proof pro firmy, které potřebují rychlý a důvěryhodný základ.",
      priceBandExample: "10 000-18 000 CZK",
      whoFor: "Lokální služby, kde jde hlavně o důvěru, rozsah prací a snadný kontakt.",
      problemSolved: "Firma je těžko dohledatelná, nepůsobí sjednoceně a zákazník neví, s čím přesně může pomoci.",
      style: "Jednoduchý, lidský, čistý a lokálně ukotvený.",
      whyItHelpsSales: "Je to bezpečný fallback i samostatně prodejný Launch Page koncept pro řadu lokálních služeb.",
      proofAngle: "Důvěra + služby + lokální dosah",
      tags: ["lokální služby", "hodinový manžel", "fallback", "launch page"],
    },
    theme: {
      shellBackground: "linear-gradient(180deg, #f7f5f1 0%, #ebe6dd 100%)",
      browserTint: "rgba(104, 90, 64, 0.12)",
      heroFrom: "#fffdf9",
      heroTo: "#ecf3ec",
      heroAccent: "#3f7a56",
      sectionBackground: "#fffefb",
      sectionMuted: "#f3f1eb",
      cardBackground: "#ffffff",
      cardMuted: "#f2f5ef",
      borderColor: "rgba(93, 103, 77, 0.14)",
      primaryText: "#334235",
      secondaryText: "rgba(51, 66, 53, 0.74)",
      accentText: "#3f7a56",
      accentSoft: "#dcecdc",
      ctaBackground: "#3f7a56",
      ctaText: "#ffffff",
    },
    hero: {
      eyebrow: "Lokální pomoc pro byt, dům i menší provoz",
      headline: "Jednoduchý web pro služby, kde rozhoduje důvěra, rychlý kontakt a jasný rozsah prací.",
      body: "Tento koncept funguje jako univerzální sales asset pro domácí servis, montáže a drobné řemeslné práce. Je srozumitelný, nehraje si na velkou firmu a rychle vysvětlí, s čím může podnik pomoct.",
      primaryCta: "Zavolat a domluvit práce",
      secondaryCta: "Poslat krátkou poptávku",
      highlights: ["Použitelné jako obecný proof", "Silný lokální dojem", "Výborné pro Launch Page"],
      stats: [
        { value: "1", label: "stručný webový základ" },
        { value: "6", label: "služeb v přehledné mřížce" },
        { value: "0", label: "zbytečných marketingových frází" },
      ],
      panelTitle: "Co je důležité nahoře",
      panelItems: [
        { title: "Rozsah prací", description: "Montáže, opravy, seřízení, drobné rekonstrukce a servis.", meta: "Domácnosti / kanceláře / provozovny" },
        { title: "Lokální dostupnost", description: "Přehled měst a částí, kam firma běžně dojíždí.", meta: "Hradec Králové a okolí" },
        { title: "Kontakt bez tření", description: "Telefon, email a stručná poptávka pro méně urgentní práce.", meta: "Rychlá domluva" },
      ],
    },
    sections: {
      servicesTitle: "Co podobný web potřebuje ukázat",
      servicesIntro: "Firmy tohoto typu často prodávají spíš spolehlivost a přehlednost než složitou specializaci. I proto je layout jednoduchý a přímý.",
      services: [
        { title: "Drobné opravy", description: "Seřízení, výměny, montáže a běžný servis v domácnosti.", meta: "Od kliky po polici" },
        { title: "Instalace a kompletace", description: "Montáž nábytku, polic, osvětlení nebo drobných zařízení.", meta: "Praktické práce bez chaosu" },
        { title: "Menší údržba", description: "Pravidelná údržba provozovny nebo bytu podle potřeby.", meta: "Jednorázově i opakovaně" },
      ],
      aboutTitle: "Proč je to dobrý fallback i samostatný produkt",
      aboutBody: "Mnoho lokálních služeb nepotřebuje složitý web. Potřebují důvěryhodnou digitální vizitku, která vysvětlí práce, lokalitu a způsob kontaktu. Přesně to tento koncept umí.",
      aboutHighlights: ["Bezpečný proof pro různé service leady", "Použitelné i bez hluboké specializace", "Dobře škálovatelné na další obory"],
      galleryTitle: "Reference a proof bloky",
      galleryIntro: "Maketa ukazuje kombinaci drobných realizací, přehled služeb a lokálního servisu.",
      galleryItems: [
        { title: "Montáž a servis", description: "Blok s jednoduchými ukázkami hotové práce." },
        { title: "Přehled služeb", description: "Mřížka s tím, co firma zvládne a co ne." },
        { title: "Kontakt a dojezd", description: "Krátká mapa, telefon a oblasti výjezdu." },
      ],
      reviewsTitle: "Jednoduchá a uvěřitelná důvěra",
      reviews: [
        { quote: "Líbí se mi, že hned vím, jestli takovou práci dělají a kam dojíždějí.", author: "Lenka P.", detail: "montáž v bytě" },
        { quote: "Web je přehledný a působí poctivě, ne jako generická služba z katalogu.", author: "David R.", detail: "drobné opravy v kanceláři" },
        { quote: "Telefon i služby jsou jasné hned nahoře. Přesně to člověk potřebuje.", author: "Veronika Š.", detail: "domácí servis" },
      ],
      faqTitle: "K čemu je tahle varianta vhodná",
      faqItems: [
        { question: "Je to moc obecné?", answer: "Pro některé obory ano, ale právě proto funguje jako bezpečný fallback nebo jako rychle prodejný základ pro service leady bez webu." },
        { question: "Dá se později rozšířit?", answer: "Ano. Launch Page může později vyrůst do jednoduchého webu se specializovanými sekcemi nebo referencemi." },
      ],
      ctaTitle: "Lokální proof vrstva, která se dá použít hned.",
      ctaBody: "Vhodné pro rychlý prodej jednoduchého webu u domácích služeb, údržby a obecnějších řemeslných leadů.",
      ctaPrimary: "Ukázat univerzální service koncept",
      ctaSecondary: "Otevřít full mockup",
    },
    contact: {
      phone: "+420 608 112 744",
      email: "zakazky@servissimek.cz",
      address: "Jiráskova 21, 500 02 Hradec Králové",
      serviceArea: "Hradec Králové, Třebechovice, Černilov a okolí",
      responseTime: "Na běžné poptávky odpovídáme zpravidla během pracovního dne.",
      hours: [
        { label: "Po-Pá", value: "08:00-17:00" },
        { label: "So", value: "po telefonické domluvě" },
        { label: "Ne", value: "zavřeno" },
      ],
    },
    footerNote: "Ukázkový sales mockup pro obecné lokální služby. Nejde o skutečnou firmu ani produkční web.",
  },
];

export function getAllMockupSlugs() {
  return LOCAL_BUSINESS_MOCKUPS.map((mockup) => mockup.slug);
}

export function getMockupBySlug(slug: string) {
  return LOCAL_BUSINESS_MOCKUPS.find((mockup) => mockup.slug === slug) ?? null;
}

export function getMockupPreviewImagePath(slug: string) {
  return `/templates/${slug}.png`;
}
