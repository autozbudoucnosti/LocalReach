import type { RecommendedOffer } from "@prisma/client";
import type { MockupKind, MockupVertical, TemplateWebsiteFit } from "@/lib/mockup-data";

export type MockupV2Service = {
  title: string;
  description: string;
  note: string;
};

export type MockupV2TrustPoint = {
  title: string;
  description: string;
};

export type MockupV2Realization = {
  title: string;
  location: string;
  summary: string;
};

export type MockupV2Review = {
  quote: string;
  author: string;
  detail: string;
};

export type MockupV2Definition = {
  id: string;
  slug: string;
  version: "V2";
  kind: MockupKind;
  vertical: MockupVertical;
  offerType: RecommendedOffer;
  websiteFit: TemplateWebsiteFit;
  recommendedForSales: boolean;
  matchKeywords: string[];
  businessName: string;
  city: string;
  gallery: {
    title: string;
    shortDescription: string;
    fitsBusiness: string;
    keyBenefit: string;
    priceBandExample: string;
    whoFor: string;
    problemSolved: string;
    style: string;
    whyItHelpsSales: string;
    proofAngle: string;
    tags: string[];
  };
  fastStrip: {
    label: string;
    text: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
    serviceBullets: string[];
    trustBullets: string[];
    stats: Array<{
      value: string;
      label: string;
    }>;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    serviceAreaLabel: string;
    hours: string;
  };
  imagery: {
    hero: string;
    references: string[];
  };
  services: MockupV2Service[];
  trustPoints: MockupV2TrustPoint[];
  realizations: MockupV2Realization[];
  reviews: MockupV2Review[];
  serviceArea: {
    intro: string;
    areas: string[];
    process: string[];
  };
  contactSection: {
    title: string;
    body: string;
    formFields: string[];
  };
  footerNote: string;
};

export const LOCAL_BUSINESS_MOCKUPS_V2: MockupV2Definition[] = [
  {
    id: "plumber-brno-v2",
    slug: "plumber-brno-v2",
    version: "V2",
    kind: "trade",
    vertical: "PLUMBER",
    offerType: "LAUNCH_PAGE",
    websiteFit: "BOTH",
    recommendedForSales: true,
    matchKeywords: [
      "instalater",
      "voda",
      "topeni",
      "plyn",
      "havarie",
      "kotel",
      "bojler",
      "odpady",
      "radiator",
      "kratochvil",
    ],
    businessName: "Instalatér Brno – P. Kratochvíl",
    city: "Brno",
    gallery: {
      title: "Instalatér Brno — světlý lokální web",
      shortDescription: "Telefon nahoře, jasné služby a konkrétní realizace. Světlý a přehledný web pro místního instalatéra v Brně.",
      fitsBusiness: "Místní instalatéři a řemeslníci bez webu nebo se slabým webem v Brně a okolí.",
      keyBenefit: "Působí jako skutečný lokální firemní web — přehledný, světlý a bez SaaS pocitu.",
      priceBandExample: "14 000-28 000 CZK",
      whoFor: "Leady, kde je potřeba rychle ukázat důvěryhodný směr pro telefon-first instalatérský web s lokálním záběrem.",
      problemSolved: "Ukazuje jednoduchý a věrohodný web pro firmu, kterou zákazník oslovuje hlavně přes telefon.",
      style: "Světlý, uzemněný, přehledný a praktický. Alternativa k tmavé verzi.",
      whyItHelpsSales: "Kombinuje rychlý kontakt, Brno framing, jasné služby a konkrétní realizace.",
      proofAngle: "Telefon nahoře + Brno lokalita + služby + realizace",
      tags: ["doporučeno", "řemeslo", "Brno", "světlý", "instalatér"],
    },
    fastStrip: {
      label: "Rychlý servis pro Brno a okolí",
      text: "Opravy a instalace pro Brno a okolí. Rychlá domluva a spolehlivý servis.",
    },
    hero: {
      eyebrow: "Brno a okolí",
      headline: "Místní instalatér pro Brno",
      body: "Opravy, výměny a běžný servis pro byty, domy i menší provozy.",
      primaryCta: "Zavolat",
      secondaryCta: "Poslat poptávku",
      serviceBullets: ["Rozvody vody a odpady", "Topení, radiátory a kotle", "Výměny bojlerů a armatur", "Běžné opravy i akutní zásahy"],
      trustBullets: ["Rychlá domluva", "Výjezdy po Brně a okolí"],
      stats: [
        { value: "15+ let praxe", label: "v oboru" },
        { value: "Brno a okolí", label: "výjezdy po městě i okolí" },
        { value: "Rychlá domluva", label: "termín bez zbytečného čekání" },
        { value: "Férové ceny", label: "jasný rozsah prací" },
      ],
    },
    contact: {
      phone: "+420 605 214 880",
      email: "info@kratochvil-instalater.cz",
      address: "Provazníkova 41, 614 00 Brno",
      serviceAreaLabel: "Brno, Kuřim, Modřice, Šlapanice a okolí",
      hours: "Po-Pá 7:00-18:00, urgentní zásahy dle dostupnosti",
    },
    imagery: {
      hero: "/mockups-v2/plumber-v2-hero.jpg",
      references: ["/mockups-v2/plumber-v2-tech.jpg", "/mockups-v2/plumber-v2-detail.jpg"],
    },
    services: [
      {
        title: "Voda a odpady",
        description: "Baterie, sifony, ventily a opravy po úniku vody.",
        note: "Byty a domy",
      },
      {
        title: "Topení a bojlery",
        description: "Radiátory, rozvody, bojlery a běžný servis.",
        note: "Servis i výměny",
      },
      {
        title: "Montáže a výměny",
        description: "Menší instalace a výměny bez zbytečného čekání.",
        note: "Rychlá domluva",
      },
    ],
    trustPoints: [
      {
        title: "Jasný kontakt a rychlá domluva",
        description: "Telefon je vidět hned nahoře a formulář je krátký. Bez zbytečných kroků navíc.",
      },
      {
        title: "Brno a okolí přehledně",
        description: "Zákazník hned vidí, jestli firma jezdí do jeho části města nebo blízkého okolí.",
      },
      {
        title: "Obsah bez přehnaných slibů",
        description: "Místo marketingových frází jsou na webu konkrétní služby, realizace a jednoduchý další krok.",
      },
    ],
    realizations: [
      {
        title: "Výměna bojleru",
        location: "Brno-Královo Pole",
        summary: "Demontáž starého kusu, nové napojení a předání v domluveném termínu.",
      },
      {
        title: "Rozvody do koupelny",
        location: "Brno-Líšeň",
        summary: "Nové rozvody vody při rekonstrukci bytu s návazností na další práce.",
      },
    ],
    reviews: [
      {
        quote: "Domluva byla rychlá, přijel včas a vše po sobě nechal v pořádku.",
        author: "Jana K.",
        detail: "Brno-Žabovřesky",
      },
      {
        quote: "Potřebovali jsme rychle vyřešit bojler a komunikace byla od začátku jasná a věcná.",
        author: "Petr M.",
        detail: "Brno-Líšeň",
      },
      {
        quote: "Oceňuji, že hned řekl, co dává smysl udělat a kolik práce bude potřeba.",
        author: "Michaela R.",
        detail: "Modřice",
      },
    ],
    serviceArea: {
      intro: "Nejčastěji jezdíme po Brně a blízkém okolí. Pokud si nejste jistí lokalitou, stačí zavolat a domluvíme se.",
      areas: ["Brno", "Kuřim", "Modřice", "Šlapanice"],
      process: ["Zavoláte nebo pošlete poptávku", "Domluvíme termín a rozsah práce", "Přijedeme na místo", "Vyřešíme problém a vše předáme"],
    },
    contactSection: {
      title: "Zavolejte nebo napište",
      body: "Stačí krátký popis problému a lokalita. Ozveme se s dalším krokem.",
      formFields: ["Jméno a telefon", "Stručný popis zakázky", "Brno / okolí"],
    },
    footerNote: "Instalatér pro Brno a okolí.",
  },
  {
    id: "plumber-brno-v1",
    slug: "plumber-brno-v1",
    version: "V2",
    kind: "trade",
    vertical: "PLUMBER",
    offerType: "LAUNCH_PAGE",
    websiteFit: "BOTH",
    recommendedForSales: true,
    matchKeywords: [
      "instalater",
      "havarijni",
      "voda",
      "topeni",
      "plyn",
      "odpady",
      "bojler",
      "kotel",
      "vtp",
      "havarie",
    ],
    businessName: "Instalatér Brno – J. Kovář",
    city: "Brno",
    gallery: {
      title: "Instalatér Brno — klasický web s tmavým hrdinou",
      shortDescription: "Tmavé hero s telefonem nahoře, trust strip, 4 karty služeb, reference a kontaktní formulář.",
      fitsBusiness: "Havarijní instalatéři a VTP živnostníci bez webu nebo se slabým webem v Brně.",
      keyBenefit: "Vypadá jako skutečný web malého řemeslníka — ne jako šablona z Wix.",
      priceBandExample: "12 000–22 000 CZK",
      whoFor: "Leady, kde je potřeba ukázat jednoduchý a věrohodný instalatérský web s havarijní linkou.",
      problemSolved: "Zákazník hned vidí, čím se firma zabývá, kde působí a jak rychle ji dosáhne.",
      style: "Tmavý, řemeslný, přímočarý — bez SaaS pocitu.",
      whyItHelpsSales: "Telefon v navigaci, tmavé hero, 4 konkrétní služby, reálné reference z Brna.",
      proofAngle: "Tmavé hero + havarijní linka + reálné reference z brněnských čtvrtí",
      tags: ["doporučeno", "řemeslo", "Brno", "havarijní", "instalatér"],
    },
    fastStrip: {
      label: "Havarijní linka",
      text: "Havarijní zásahy pro Brno a okolí — prasknutá trubka, ucpaný odpad, nefunkční bojler. Volejte.",
    },
    hero: {
      eyebrow: "Instalatér – Brno a okolí",
      headline: "Rychlý instalatér pro Brno",
      body: "Havarijní zásahy, opravy i menší montáže. Příjezd do 60 minut v rámci Brna.",
      primaryCta: "Volat: +420 602 341 756",
      secondaryCta: "Nezávazná poptávka",
      serviceBullets: ["Havarijní zásahy 24/7", "Voda, odpady a topení", "Plyn s revizní zprávou"],
      trustBullets: ["20+ let v oboru", "Certifikovaný technik", "Brno a okolí"],
      stats: [
        { value: "20+ let", label: "praxe v oboru" },
        { value: "Do 60 min", label: "příjezd v Brně" },
        { value: "Certifikovaný", label: "instalatér a technik" },
      ],
    },
    contact: {
      phone: "+420 602 341 756",
      email: "j.kovar.instalater@seznam.cz",
      address: "Hybešova 22, 602 00 Brno",
      serviceAreaLabel: "Brno, Kuřim, Šlapanice, Modřice, Sokolnice",
      hours: "Po–Pá 7:00–16:00, havarijní zásahy 24/7",
    },
    imagery: {
      hero: "/mockups-v2/plumber-v2-hero.jpg",
      references: ["/mockups-v2/plumber-v2-tech.jpg", "/mockups-v2/plumber-v2-detail.jpg"],
    },
    services: [
      {
        title: "Havarijní zásah",
        description: "Praskla trubka nebo nefunguje bojler? Příjezd do 60 minut v rámci Brna.",
        note: "Dostupné 24/7",
      },
      {
        title: "Instalace a opravy",
        description: "Baterie, sifony, ventily, WC splachovač. Malé opravy bez zbytečného čekání.",
        note: "Byty a domy",
      },
      {
        title: "Čistění odpadů",
        description: "Ucpaný odpad v koupelně nebo kuchyni. Mechanicky i tlakovou vodou.",
        note: "Do 48 hodin",
      },
      {
        title: "Plyn s revizí",
        description: "Sporáky, kotle, průtokové ohřívače. S platnou revizní zprávou a protokolem.",
        note: "S revizní zprávou",
      },
    ],
    trustPoints: [
      {
        title: "Férové ceny bez skrytých položek",
        description: "Před zahájením práce dostanete orientační nacenění. Žádné překvapení na faktuře.",
      },
      {
        title: "Místní technik, ne dispečink",
        description: "Nejezdím z Prahy. Brno a okolí znám. Termíny domlouvám přímo, bez prostředníka.",
      },
      {
        title: "Práce s protokolem",
        description: "Na plynové montáže vydávám revizní zprávu. Pojišťovna i pojistná událost to ocení.",
      },
    ],
    realizations: [
      {
        title: "Výměna prasklého potrubí",
        location: "Brno-Židenice",
        summary: "Havárie v bytě v panelovém domě. Příjezd tentýž den, oprava do 3 hodin.",
      },
      {
        title: "Rozvody v koupelně",
        location: "Brno-Líšeň",
        summary: "Kompletní nové rozvody vody a odpadů při rekonstrukci koupelny na klíč.",
      },
    ],
    reviews: [
      {
        quote: "Přijel tentýž den, cena odpovídala tomu, co bylo řečeno předem. Doporučuju.",
        author: "Radek S.",
        detail: "Brno-Židenice",
      },
      {
        quote: "Potřebovala jsem vyměnit kotel, pan Kovář přišel se správným dílem hned napoprvé. Ušetřilo to celý den čekání.",
        author: "Eva B.",
        detail: "Kuřim",
      },
      {
        quote: "Čistil odpad v paneláku. Přesný nástup, po sobě nechal pořádek. Víc po instalatérovi nechci.",
        author: "Tomáš K.",
        detail: "Brno-Slatina",
      },
    ],
    serviceArea: {
      intro: "Jezdím pravidelně po celém Brně a blízkém okolí. Pokud si nejste jisti lokalitou, zavolejte.",
      areas: ["Brno", "Kuřim", "Modřice", "Šlapanice", "Sokolnice"],
      process: [
        "Zavoláte nebo pošlete zprávu",
        "Domluva termínu a rozsahu práce",
        "Příjezd na místo",
        "Oprava nebo montáž s předáním",
      ],
    },
    contactSection: {
      title: "Kontaktujte nás",
      body: "Stačí popsat problém a sdělit lokalitu. Ozvu se a domluvíme termín.",
      formFields: ["Jméno a telefonní číslo", "E-mail (nepovinné)", "Popis zakázky", "Brno / okolí – lokalita"],
    },
    footerNote: "Instalatér Brno a okolí. IČO: 12345678. Živnostník zapsaný v živnostenském rejstříku.",
  },
  {
    id: "stomatolog-praha-v1",
    slug: "stomatolog-praha-v1",
    version: "V2",
    kind: "medical",
    vertical: "DENTAL",
    offerType: "SIMPLE_WEBSITE",
    websiteFit: "BOTH",
    recommendedForSales: true,
    matchKeywords: [
      "stomatolog",
      "zubař",
      "zubni",
      "zubar",
      "klinika",
      "ordinace",
      "implant",
      "bělení",
      "korunka",
      "protetika",
    ],
    businessName: "Zubní ordinace MUDr. Horáčková",
    city: "Praha 2",
    gallery: {
      title: "Zubní klinika Praha",
      shortDescription: "Čistý medicínský web s online objednávkou, důrazem na certifikaci a konkrétní výčet výkonů.",
      fitsBusiness: "Soukromé zubní ordinace a menší stomatologické kliniky v Praze.",
      keyBenefit: "Působí jako věrohodná soukromá praxe — ne korporátní řetězec, ne zastaralý web.",
      priceBandExample: "16 000–32 000 CZK",
      whoFor: "Leady, kde soukromá praxe nemá web nebo má zastaralou stránku bez online objednání.",
      problemSolved: "Ukazuje moderní, přehlednou a důvěryhodnou prezentaci s jasnou cestou k objednání.",
      style: "Čistý, světlý, medicínsky důvěryhodný. Bez zbytečné grafiky.",
      whyItHelpsSales: "Online objednávka jako primární CTA je pro zubní ordinace přirozený očekávaný standard.",
      proofAngle: "ČSK certifikace + roky praxe + konkrétní výkony + recenze s jménem a čtvrtí",
      tags: ["doporučeno", "medicína", "Praha", "stomatologie"],
    },
    fastStrip: {
      label: "Soukromá zubní ordinace Praha 2",
      text: "Soukromá praxe v Praze 2. Nové pacienty přijímáme — objednejte se online nebo zavolejte.",
    },
    hero: {
      eyebrow: "Praha 2 — Vinohrady",
      headline: "Zubní ordinace, na kterou se spolehněte",
      body: "Soukromá praxe MUDr. Horáčkové v centru Prahy. Prevence, ošetření i estetické výkony v příjemném prostředí bez frontování.",
      primaryCta: "Objednat se online",
      secondaryCta: "Zavolat",
      serviceBullets: ["Preventivní prohlídky a čištění", "Výplně a ošetření kořenových kanálků", "Zubní korunky a protetika", "Bělení zubů"],
      trustBullets: ["Člen České stomatologické komory", "15 let praxe"],
      stats: [
        { value: "15 let", label: "praxe v oboru" },
        { value: "800+", label: "spokojených pacientů" },
        { value: "4,9 ★", label: "hodnocení na Google" },
        { value: "ČSK", label: "certifikovaná členka" },
      ],
    },
    contact: {
      phone: "+420 731 882 441",
      email: "recepce@zuby-horackova.cz",
      address: "Mánesova 28, 120 00 Praha 2 — Vinohrady",
      serviceAreaLabel: "Praha 2, Praha 3 a okolí",
      hours: "Po–Čt 8:00–17:00, Pá 8:00–13:00",
    },
    imagery: {
      hero: "/mockups-v2/stomatolog-hero.jpg",
      references: ["/mockups-v2/plumber-v2-detail.jpg", "/mockups-v2/plumber-v2-tech.jpg"],
    },
    services: [
      {
        title: "Preventivní prohlídka a hygiena",
        description: "Kompletní prohlídka chrupu, profesionální čištění zubního kamene a instruktáž domácí péče.",
        note: "Doporučeno 2× ročně",
      },
      {
        title: "Výplně a ošetření",
        description: "Kompozitní a amalgámové výplně, ošetření kořenových kanálků. Vše pod lokální anestezií.",
        note: "Přijímáme pojišťovny",
      },
      {
        title: "Korunky a protetika",
        description: "Zubní korunky, můstky a snímatelné protézy. Spolupráce s osvědčenou zubní laboratoří.",
        note: "Keramika i zirkon",
      },
      {
        title: "Bělení zubů",
        description: "Ambulantní bělení s profesionálními prostředky. Výsledek viditelný po první návštěvě.",
        note: "Estetická stomatologie",
      },
    ],
    trustPoints: [
      {
        title: "Člen České stomatologické komory",
        description: "MUDr. Horáčková je členkou ČSK od roku 2009 a pravidelně absolvuje odborná školení.",
      },
      {
        title: "Smluvní ordinace pojišťoven",
        description: "Smluvní partneři VZP, OZP a ZPMV. Základní výkony hradí pojišťovna, nadstandardní výkony za jasný ceník.",
      },
      {
        title: "Online objednání bez čekání na recepci",
        description: "Pacienti si termín volí sami přes online formulář. Potvrzení přijde SMS do 24 hodin.",
      },
    ],
    realizations: [
      {
        title: "Kompletní rekonstrukce úsměvu",
        location: "Praha 2",
        summary: "Kombinace korunek a bělení v průběhu čtyř návštěv. Pacientka přišla s doporučením od kolegyně.",
      },
      {
        title: "Ošetření kořenových kanálků",
        location: "Praha 3 — Žižkov",
        summary: "Urgentní ošetření s návaznou rekonstrukcí. Výkon proběhl bez komplikací, pacient odcházel bez bolesti.",
      },
    ],
    reviews: [
      {
        quote: "Přišla jsem s obavami, odcházela jsem spokojená. MUDr. Horáčková vše klidně vysvětlila a zákrok byl bezbolestný.",
        author: "Lucie V.",
        detail: "Praha 2 — Vinohrady",
      },
      {
        quote: "Konečně ordinace, kde se nemusím bát říct, že se bojím zubařky. Personál je trpělivý a prostředí příjemné.",
        author: "Ondřej K.",
        detail: "Praha 3 — Žižkov",
      },
      {
        quote: "Objednala jsem se online v neděli večer, do pondělka ráno měla jsem potvrzení. Perfektní.",
        author: "Martina S.",
        detail: "Praha 2 — Nusle",
      },
    ],
    serviceArea: {
      intro: "Ordinace se nachází na Vinohradech, snadno dostupná metrem A i C. Přijímáme pacienty z celé Prahy.",
      areas: ["Praha 2", "Praha 3", "Praha 4", "Praha 10"],
      process: [
        "Vyberete termín přes online formulář nebo zavoláte",
        "Potvrzení termínu obdržíte SMS do 24 hodin",
        "První návštěva — vstupní prohlídka a plán ošetření",
        "Ošetření dle dohodnutého plánu",
      ],
    },
    contactSection: {
      title: "Objednejte se",
      body: "Vyplňte krátký formulář a my Vám potvrdíme termín do jednoho pracovního dne.",
      formFields: ["Jméno a telefonní číslo", "E-mail", "Preferovaný termín (den a čas)", "Důvod návštěvy (volitelně)"],
    },
    footerNote: "Zubní ordinace MUDr. Petra Horáčková. IČO: 87654321. Mánesova 28, Praha 2. Člen ČSK. Smluvní ordinace VZP, OZP, ZPMV.",
  },
  {
    id: "bistro-brno-v1",
    slug: "bistro-brno-v1",
    version: "V2",
    kind: "gastro",
    vertical: "RESTAURANT",
    offerType: "SIMPLE_WEBSITE",
    websiteFit: "BOTH",
    recommendedForSales: true,
    matchKeywords: [
      "bistro",
      "restaurace",
      "jidlo",
      "menu",
      "vecere",
      "obed",
      "rezervace",
      "kuchyne",
      "vino",
      "stravovani",
      "podlipami",
    ],
    businessName: "Bistro Pod Lipami",
    city: "Brno",
    gallery: {
      title: "Bistro Brno — teplý editoriální web",
      shortDescription: "Plnoformátové hero s jídlem, rezervace jako primární CTA, náhled menu a recenze. Tmavý, teplý vizuál pro místní bistro.",
      fitsBusiness: "Místní bistro, wine bistro a menší restaurace bez webu nebo se zastaralou stránkou v Brně.",
      keyBenefit: "Působí jako skutečný útulný podnik — ne luxusní restaurace, ne generická šablona.",
      priceBandExample: "16 000–30 000 CZK",
      whoFor: "Leady v gastro segmentu bez webu nebo jen s Facebookem — rychlý vizuální argument pro rezervaci a návštěvnost.",
      problemSolved: "Host ihned vidí atmosféru, co se vaří, kde podnik je a jak si zarezervovat stůl.",
      style: "Teplý editoriální tmavý web s jantarovým akcentem, serifový nadpis, plnoformátový hrdina. Žádný fine-dining pocit.",
      whyItHelpsSales: "Foto jako dominanta + rezervace nahoře + náhled menu + Google hodnocení = okamžitá důvěryhodnost.",
      proofAngle: "Google hodnocení + rok otevření + jídlo v hrdinovi + rezervační CTA",
      tags: ["doporučeno", "gastro", "Brno", "tmavý", "bistro"],
    },
    fastStrip: {
      label: "Bistro v Brně-Židenicích",
      text: "Domácí kuchyně a moravské víno v Brně. Otevřeno každý den od 11:00. Rezervace telefonicky.",
    },
    hero: {
      eyebrow: "Brno — Židenice",
      headline: "Domácí kuchyně a pohoda v srdci Brna",
      body: "Vaříme z čerstvých surovin od lokálních dodavatelů. Každý den polévka, stálé menu a sezónní speciality.",
      primaryCta: "Rezervovat stůl",
      secondaryCta: "Jídelní lístek",
      serviceBullets: ["Domácí česká kuchyně", "Denní polévka a menu", "Víno ze sklípku z Moravy", "Rezervace telefonicky"],
      trustBullets: ["Otevřeno každý den", "35 míst uvnitř + letní terasa"],
      stats: [
        { value: "Od 2017", label: "v Brně" },
        { value: "4.8 ★", label: "Google hodnocení" },
        { value: "35 míst", label: "uvnitř + terasa" },
        { value: "Po–Ne", label: "otevřeno každý den" },
      ],
    },
    contact: {
      phone: "+420 775 448 220",
      email: "info@bistropodlipami.cz",
      address: "Jugoslávská 12, 613 00 Brno-Židenice",
      serviceAreaLabel: "Brno-Židenice, Brno-Královo Pole a okolí",
      hours: "Po–Pá 11:00–22:00 · So 12:00–23:00 · Ne 12:00–21:00",
    },
    imagery: {
      hero: "/templates/cozy-cafe.png",
      references: ["/mockups-v2/bistro-v1-food.jpg", "/mockups-v2/bistro-v1-interior.jpg"],
    },
    services: [
      {
        title: "Hovězí líčka na červeném víně",
        description: "Pomalu dušená hovězí líčka s bramborovým pyré a čerstvými bylinkami.",
        note: "Hlavní chod · od 259 Kč",
      },
      {
        title: "Polévka dne",
        description: "Každý den jiná — z vlastního vývaru, poctivě uvařená. Mění se podle sezóny.",
        note: "Polévka · 59 Kč",
      },
      {
        title: "Tartar z hovězí svíčkové",
        description: "Čerstvý tartar s toastem, kapary a žloutkem. Připraveno na místě.",
        note: "Předkrm · od 189 Kč",
      },
      {
        title: "Moravská svíčková",
        description: "Klasická svíčková na smetaně s houskovým knedlíkem a brusinkami.",
        note: "Klasika · od 229 Kč",
      },
    ],
    trustPoints: [
      {
        title: "Lokální suroviny, poctivá příprava",
        description: "Zeleninu a maso odebíráme od jihomoravských dodavatelů. Žádné polotovary, žádné zkratky.",
      },
      {
        title: "Útulný prostor bez uspěchanosti",
        description: "35 míst uvnitř a letní terasa. Přijďte na oběd nebo klidnou večeři — rezervaci potvrdíme obratem.",
      },
      {
        title: "Osobní přístup od prvního kontaktu",
        description: "Bistro vede Lucie Marková osobně. Ráda poradí s výběrem nebo naplánuje soukromý večírek pro skupinu.",
      },
    ],
    realizations: [
      {
        title: "Sezónní menu — jaro 2024",
        location: "Brno-Židenice",
        summary: "Jarní menu s chřestem, čerstvými bylinkami a moravským vínem. Obsazenost na 90 % po dobu 3 týdnů.",
      },
      {
        title: "Firemní večeře pro 25 hostů",
        location: "Brno",
        summary: "Soukromá část bistra pro firemní večírek. Sestavené degustační menu, vše domluveno telefonicky.",
      },
    ],
    reviews: [
      {
        quote: "Nejlepší svíčková v Brně. To říkám upřímně a byl jsem tu už mockrát.",
        author: "Tomáš K.",
        detail: "Brno-Židenice",
      },
      {
        quote: "Útulné místo, přátelský personál a jídlo z čerstvých surovin. Chodíme sem pravidelně.",
        author: "Lucie N.",
        detail: "Brno-Královo Pole",
      },
      {
        quote: "Rezervaci jsme dostali hned, při příchodu nás uvítali jménem. Příjemný a nenafoukaný podnik.",
        author: "Martin V.",
        detail: "Brno",
      },
    ],
    serviceArea: {
      intro: "Bistro má omezený počet míst. Rezervaci doporučujeme, zejména na víkendy a večerní hodiny.",
      areas: ["Brno-Židenice", "Brno-Královo Pole", "Brno-střed", "Brno a okolí"],
      process: [
        "Zavolejte nebo pošlete rezervaci online",
        "Potvrdíme termín a počet míst",
        "Přijdete, stůl bude připravený",
        "Večeříte bez spěchu a čekání",
      ],
    },
    contactSection: {
      title: "Rezervujte si stůl",
      body: "Stačí zavolat nebo vyplnit krátký formulář. Odpovídáme do 2 hodin.",
      formFields: ["Jméno a telefon", "Datum a čas návštěvy", "Počet osob", "Poznámka (alergie, oslava apod.)"],
    },
    footerNote: "Bistro Pod Lipami · Jugoslávská 12, Brno · IČO: 06712845 · Otevřeno každý den",
  },

  // ── RESTAURANT — Praha 2 ─────────────────────────────────────────────────
  {
    id: "restaurace-praha-v1",
    slug: "restaurace-praha-v1",
    version: "V2",
    kind: "gastro",
    vertical: "RESTAURANT",
    offerType: "SIMPLE_WEBSITE",
    websiteFit: "BOTH",
    recommendedForSales: true,
    matchKeywords: [
      "restaurace",
      "poledni-menu",
      "obedove-menu",
      "ceska-kuchyne",
      "vinohrady",
      "svickova",
      "knedlik",
      "pivo",
      "vino",
      "rezervace",
      "vecere",
      "obed",
      "vinohrady",
      "u-koruny",
    ],
    businessName: "Restaurace U Koruny",
    city: "Praha 2",
    gallery: {
      title: "Restaurace Praha 2 — světlý tradiční web s poledním menu",
      shortDescription: "Teplý krémový web pro klasickou českou restauraci. Polední menu jako hlavní CTA, rezervace jako sekundární akce. Zcela odlišný vizuál od bistra.",
      fitsBusiness: "Klasické české restaurace bez webu nebo se zastaralým webem v Praze a okolí.",
      keyBenefit: "Polední menu viditelné hned — největší denní provoz restaurace okamžitě konvertuje.",
      priceBandExample: "18 000–35 000 CZK",
      whoFor: "Leady v gastro segmentu v Praze — restaurace bez webu, se starým webem nebo jen Facebookem.",
      problemSolved: "Host okamžitě vidí dnešní menu, kde restauraci najde, co se vaří a jak si zarezervovat.",
      style: "Teplý krémový základ, tmavě zelený akcent, serifový nadpis. Žádný bistro ani fine-dining pocit. Tradiční a věrohodný.",
      whyItHelpsSales: "Polední menu nahoře + telefonní číslo + rezervace + Google hodnocení = okamžitý argument pro majitele.",
      proofAngle: "Rok otevření + Google hodnocení + polední menu + adresa Praha 2",
      tags: ["doporučeno", "gastro", "Praha", "světlý", "restaurace", "polední-menu"],
    },
    fastStrip: {
      label: "Česká restaurace v Praze 2 – Vinohradech",
      text: "Polední menu každý pracovní den od 11:00 do 14:30. Večeře v klidné atmosféře. Rezervace telefonicky nebo online.",
    },
    hero: {
      eyebrow: "Praha 2 — Vinohrady",
      headline: "Poctivá česká kuchyně na Vinohradech",
      body: "Vaříme každý den od základu — z čerstvých surovin, bez polotovarů. Polední menu se mění denně. Večerní rezervace na počkání.",
      primaryCta: "Polední menu",
      secondaryCta: "Rezervovat stůl",
      serviceBullets: [
        "Denní polední menu od 139 Kč",
        "Klasická česká kuchyně",
        "Moravská a česká vína",
        "Český pivo čepované",
      ],
      trustBullets: ["Po–Pá 11:00–22:00 · So–Ne 12:00–22:00", "60 míst uvnitř + letní předzahrádka"],
      stats: [
        { value: "Od 2009", label: "na Vinohradech" },
        { value: "4.7 ★", label: "Google hodnocení" },
        { value: "60 míst", label: "uvnitř + předzahrádka" },
        { value: "Po–Ne", label: "otevřeno každý den" },
      ],
    },
    contact: {
      phone: "+420 222 514 880",
      email: "restaurace@ukoruny-vinohrady.cz",
      address: "Mánesova 14, 120 00 Praha 2 – Vinohrady",
      serviceAreaLabel: "Praha 2, Praha 3 a centrum Prahy",
      hours: "Po–Pá 11:00–22:00 · So–Ne 12:00–22:00",
    },
    imagery: {
      hero: "/mockups-v2/restaurace-v1-hero.jpg",
      references: ["/mockups-v2/restaurace-v1-food.jpg", "/mockups-v2/restaurace-v1-interior.jpg"],
    },
    services: [
      {
        title: "Svíčková na smetaně",
        description: "Hovězí svíčková s houskovým knedlíkem, brusinkami a šlehačkou. Vařená celý den na pomalém ohni.",
        note: "Hlavní chod · 219 Kč",
      },
      {
        title: "Polévka dne",
        description: "Každý den jiná polévka z vlastního vývaru. Mění se podle sezóny a dostupnosti surovin.",
        note: "Polévka · 55 Kč",
      },
      {
        title: "Vepřová pečeně se zelím",
        description: "Klasická pečená vepřová s dušeným zelím a bramborovým knedlíkem. Stálá položka jídelníčku.",
        note: "Klasika · 185 Kč",
      },
      {
        title: "Smažený sýr s tatarkou",
        description: "Smažený eidam s domácí tatarskou omáčkou a hranolkami. Oblíbená volba na oběd.",
        note: "Denní menu · 159 Kč",
      },
    ],
    trustPoints: [
      {
        title: "Polední menu každý pracovní den",
        description: "Dvě polévky, čtyři hlavní jídla a dezert — vše čerstvě uvařené. Vydáváme od 11:00 do 14:30, dokud se nevyprodá.",
      },
      {
        title: "Bez polotovarů, vše z čerstvých surovin",
        description: "Maso odebíráme od českých dodavatelů, zeleninu z farmářského trhu. Žádné konzervy ani zmrazené polotovary.",
      },
      {
        title: "Klidná atmosféra, bez spěchu",
        description: "Nejsme fastfood. Hostům přejeme klidný oběd nebo večeři. Rezervace doporučujeme, zejména na víkendy.",
      },
    ],
    realizations: [
      {
        title: "Rodinná oslava — 40 hostů",
        location: "Praha 2",
        summary: "Soukromý prostor pro rodinnou oslavu s polodenním bufetovým menu. Vše domluveno telefonicky a potvrzeno do 24 hodin.",
      },
      {
        title: "Firemní obědy — pravidelná firma z Vinohrad",
        location: "Praha 2",
        summary: "Pravidelné skupinové obědy pro 12 zaměstnanců každý pátek. Rezervace stolu, volba z denního menu.",
      },
    ],
    reviews: [
      {
        quote: "Svíčková jako u babičky — a to říkám upřímně. Chodíme sem každý týden na oběd.",
        author: "Jana Horáčková",
        detail: "Praha 2 – Vinohrady",
      },
      {
        quote: "Klidné místo, personál mile překvapil. Polední menu výborné a porce slušné.",
        author: "Ondřej M.",
        detail: "Praha 3 – Žižkov",
      },
      {
        quote: "Rezervaci jsme dostali na stejný den, přivítali nás s úsměvem. Doporučuji na firemní obědy.",
        author: "Petra K.",
        detail: "Praha 2",
      },
    ],
    serviceArea: {
      intro: "Restaurace se nachází v klidné části Vinohrad, 3 minuty pěšky od metra Náměstí Míru. Parkování v ulici nebo v garáži Mánesova.",
      areas: ["Praha 2 – Vinohrady", "Praha 3 – Žižkov", "Praha 1 – Nové Město", "Praha a okolí"],
      process: [
        "Podívejte se na dnešní polední menu online nebo zavolejte",
        "Zarezervujte stůl telefonicky nebo přijďte bez rezervace na oběd",
        "Stůl bude připravený a personál na Vás čeká",
        "Jídlo a pohoda — bez spěchu",
      ],
    },
    contactSection: {
      title: "Rezervujte si stůl",
      body: "Stačí zavolat nebo vyplnit online formulář. Potvrdíme do 2 hodin.",
      formFields: ["Jméno a telefon", "Datum a čas", "Počet osob", "Poznámka (oslava, alergie, předzahrádka apod.)"],
    },
    footerNote: "Restaurace U Koruny · Mánesova 14, Praha 2 · IČO: 28194730 · Otevřeno každý den",
  },
];

export function getMockupV2BySlug(slug: string) {
  return LOCAL_BUSINESS_MOCKUPS_V2.find((mockup) => mockup.slug === slug) ?? null;
}

export function getAllMockupV2Slugs() {
  return LOCAL_BUSINESS_MOCKUPS_V2.map((mockup) => mockup.slug);
}

export function getMockupV2PreviewImagePath(slug: string) {
  return `/mockups-v2/${slug}.png`;
}
