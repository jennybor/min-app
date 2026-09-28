// Oppdiktede eksempeldata for prototypen. Ikke ekte annonser eller ekte NAF-data.

export type Vurdering = "godt" | "sjekk" | "forsiktig";
export type Status = "bra" | "obs" | "darlig";

export type Punkt = {
  tittel: string;
  verdi: string;
  status: Status;
  forklaring: string;
};

export type Bil = {
  id: string;
  navn: string;
  variant: string;
  ar: number;
  km: number;
  pris: number;
  sted: string;
  farge: string;
  vurdering: Vurdering;
  oppsummering: string;
  prisLav: number;
  prisSnitt: number;
  prisHoy: number;
  antallSammenlignet: number;
  punkter: Punkt[];
  svakheter: string[];
  sporsmal: string[];
};

export const biler: Bil[] = [
  {
    id: "yaris",
    navn: "Toyota Yaris",
    variant: "1.5 Hybrid Active, automat",
    ar: 2017,
    km: 78000,
    pris: 139900,
    sted: "Drammen",
    farge: "#c8d3dc",
    vurdering: "godt",
    oppsummering:
      "Prisen er lavere enn for lignende biler, og bilen har fulgt servicen. Dette ser ut som et trygt kjøp.",
    prisLav: 128000,
    prisSnitt: 152000,
    prisHoy: 171000,
    antallSammenlignet: 214,
    punkter: [
      {
        tittel: "Kilometerstand",
        verdi: "78 000 km",
        status: "bra",
        forklaring:
          "En vanlig bil kjører rundt 12 000 km i året. For en bil fra 2017 er dette litt under normalt.",
      },
      {
        tittel: "EU-kontroll",
        verdi: "Godkjent til mai 2027",
        status: "bra",
        forklaring:
          "EU-kontroll er den lovpålagte sjekken av at bilen er trygg. Den er nylig godkjent, så du slipper den på en stund.",
      },
      {
        tittel: "Servicehistorikk",
        verdi: "Full, hos merkeverksted",
        status: "bra",
        forklaring:
          "Bilen har hatt service slik produsenten anbefaler. Det tyder på at den er tatt godt vare på.",
      },
      {
        tittel: "Antall eiere",
        verdi: "2 eiere",
        status: "bra",
        forklaring: "Få eiere er ofte et godt tegn. Det betyr at bilen ikke har vært byttet mye rundt.",
      },
    ],
    svakheter: [
      "Hybridbatteriet holder normalt svært lenge på denne modellen. Spør om det er sjekket ved siste service.",
      "Noen eiere melder om slitte bremseskiver fordi bilen bremser mye med motoren. Enkelt og billig å bytte.",
    ],
    sporsmal: [
      "Kan jeg se servicehefte eller utskrift fra verkstedet?",
      "Har bilen vært skadet eller reparert etter en ulykke?",
      "Følger det med vinterhjul?",
    ],
  },
  {
    id: "golf",
    navn: "Volkswagen Golf",
    variant: "1.4 TSI Highline, manuell",
    ar: 2014,
    km: 162000,
    pris: 89000,
    sted: "Trondheim",
    farge: "#2f3a4a",
    vurdering: "sjekk",
    oppsummering:
      "Prisen er omtrent som for lignende biler, men det mangler service de siste to årene. Sjekk dette før du bestemmer deg.",
    prisLav: 72000,
    prisSnitt: 91000,
    prisHoy: 108000,
    antallSammenlignet: 389,
    punkter: [
      {
        tittel: "Kilometerstand",
        verdi: "162 000 km",
        status: "obs",
        forklaring:
          "Litt over det vanlige for alderen. Det er ikke farlig i seg selv, men det betyr at flere deler kan trenge bytte snart.",
      },
      {
        tittel: "EU-kontroll",
        verdi: "Godkjent til august 2026",
        status: "obs",
        forklaring:
          "Neste EU-kontroll er ganske snart. Spør selgeren om bilen blir godkjent, eller regn med noen utgifter.",
      },
      {
        tittel: "Servicehistorikk",
        verdi: "Mangler siste 2 år",
        status: "darlig",
        forklaring:
          "Bilen har ikke hatt service på to år. Det kan bety at noe er utsatt, som olje eller bremser.",
      },
      {
        tittel: "Antall eiere",
        verdi: "4 eiere",
        status: "obs",
        forklaring: "Ganske mange eiere. Det er vanlig for en eldre bil, men gjør historikken viktigere.",
      },
    ],
    svakheter: [
      "Motoren kan få problemer med kamkjeden på eldre utgaver. Lytt etter en raslende lyd når motoren er kald.",
      "Kløtsjen kan være slitt ved denne kilometerstanden. Et bytte koster rundt 12 000 kr.",
    ],
    sporsmal: [
      "Hvorfor har bilen ikke hatt service de siste to årene?",
      "Er kamkjeden byttet eller sjekket?",
      "Kan jeg ta bilen med til en bruktbiltest før jeg kjøper?",
    ],
  },
  {
    id: "leaf",
    navn: "Nissan Leaf",
    variant: "24 kWh Acenta, elbil",
    ar: 2016,
    km: 110000,
    pris: 119000,
    sted: "Bergen",
    farge: "#e8e4dc",
    vurdering: "forsiktig",
    oppsummering:
      "Prisen er mye høyere enn for lignende biler, og batteriet på denne modellen svekkes med årene. Vær forsiktig.",
    prisLav: 62000,
    prisSnitt: 78000,
    prisHoy: 96000,
    antallSammenlignet: 156,
    punkter: [
      {
        tittel: "Kilometerstand",
        verdi: "110 000 km",
        status: "obs",
        forklaring:
          "Normalt for alderen. For en elbil er batteriets tilstand viktigere enn antall kilometer.",
      },
      {
        tittel: "Batteri",
        verdi: "Ikke oppgitt i annonsen",
        status: "darlig",
        forklaring:
          "Et elbilbatteri mister kapasitet over tid, og da kommer du kortere på en lading. Be om en batteritest (SOH).",
      },
      {
        tittel: "EU-kontroll",
        verdi: "Godkjent til mars 2027",
        status: "bra",
        forklaring: "Bilen er nylig godkjent, så du slipper kontrollen på en stund.",
      },
      {
        tittel: "Antall eiere",
        verdi: "3 eiere",
        status: "obs",
        forklaring: "Et normalt antall for en bil på denne alderen.",
      },
    ],
    svakheter: [
      "Batteriet på 24 kWh-utgaven svekkes merkbart. Mange kommer bare 80 til 100 km på en lading om vinteren.",
      "Bilen har ikke aktiv kjøling av batteriet, så hurtiglading flere ganger på rad går tregt.",
    ],
    sporsmal: [
      "Hvor mange av de tolv strekene for batterikapasitet viser bilen?",
      "Hvor langt kommer bilen på en full lading om vinteren?",
      "Kan dere gå ned i pris, når lignende biler selges for rundt 78 000 kr?",
    ],
  },
];

// Prototypen kan ikke hente fra Finn, så en innlimt lenke gir alltid samme eksempelbil.
export function bilFraLenke(lenke: string): Bil {
  let sum = 0;
  for (const tegn of lenke) sum += tegn.charCodeAt(0);
  return biler[sum % biler.length];
}

export function kroner(belop: number): string {
  return belop.toLocaleString("nb-NO") + " kr";
}
