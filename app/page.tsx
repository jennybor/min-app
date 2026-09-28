"use client";

import { useState } from "react";
import { biler, bilFraLenke, kroner, type Bil, type Status, type Vurdering } from "@/lib/biler";

const vurderingStil: Record<Vurdering, { tekst: string; ikon: string; boks: string }> = {
  godt: { tekst: "Godt kjøp", ikon: "✓", boks: "bg-emerald-50 border-emerald-300 text-emerald-900" },
  sjekk: { tekst: "Greit, men sjekk dette", ikon: "!", boks: "bg-amber-50 border-amber-300 text-amber-900" },
  forsiktig: { tekst: "Vær forsiktig", ikon: "✕", boks: "bg-rose-50 border-rose-300 text-rose-900" },
};

const statusStil: Record<Status, { prikk: string; etikett: string }> = {
  bra: { prikk: "bg-emerald-500", etikett: "Bra" },
  obs: { prikk: "bg-amber-400", etikett: "Verdt å sjekke" },
  darlig: { prikk: "bg-rose-500", etikett: "Obs" },
};

export default function Home() {
  const [bil, setBil] = useState<Bil | null>(null);

  function velgBil(ny: Bil) {
    setBil(ny);
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="flex flex-1 flex-col">
      <Topp onHjem={() => setBil(null)} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:py-12">
        {bil ? <Resultat bil={bil} onTilbake={() => setBil(null)} /> : <Start onVelg={velgBil} />}
      </main>
      <footer className="px-4 pb-8 text-center text-xs text-zinc-500">
        Konseptprototype laget for brukertesting. Ikke en ekte NAF-tjeneste. Alle biler, priser og
        råd er eksempeldata.
      </footer>
    </div>
  );
}

function Topp({ onHjem }: { onHjem: () => void }) {
  return (
    <header className="bg-gul">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <button onClick={onHjem} className="text-left">
          <span className="block text-lg font-bold leading-tight">NAF Kjøpsråd</span>
          <span className="block text-xs">for deg som skal kjøpe bruktbil</span>
        </button>
        <span className="rounded-full bg-black/10 px-3 py-1 text-xs font-medium">Prototype</span>
      </div>
    </header>
  );
}

function Start({ onVelg }: { onVelg: (bil: Bil) => void }) {
  const [lenke, setLenke] = useState("");
  const [feil, setFeil] = useState("");

  function sjekk(e: React.FormEvent) {
    e.preventDefault();
    const renset = lenke.trim();
    if (!renset) {
      setFeil("Lim inn lenken til annonsen først.");
      return;
    }
    if (!renset.includes("finn.no")) {
      setFeil("Det ser ikke ut som en lenke fra Finn. Den skal starte med finn.no eller https://www.finn.no.");
      return;
    }
    setFeil("");
    onVelg(bilFraLenke(renset));
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Er bruktbilen et godt kjøp?</h1>
        <p className="text-lg text-zinc-700">
          Lim inn lenken til annonsen på Finn. Vi forklarer hva annonsen betyr, sammenligner med
          lignende biler, og sier rett ut hva du bør passe på.
        </p>
      </section>

      <form onSubmit={sjekk} className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm">
        <label htmlFor="lenke" className="font-medium">
          Lenke til annonsen
        </label>
        <input
          id="lenke"
          type="text"
          inputMode="url"
          value={lenke}
          onChange={(e) => setLenke(e.target.value)}
          placeholder="https://www.finn.no/mobility/item/..."
          className="rounded-xl border border-zinc-300 px-4 py-3 text-base outline-none focus:border-zinc-900"
        />
        {feil && <p className="text-sm text-rose-700">{feil}</p>}
        <button
          type="submit"
          className="rounded-xl bg-foreground px-5 py-3 text-base font-semibold text-white transition-transform active:scale-[0.98]"
        >
          Sjekk bilen
        </button>
      </form>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">Har du ingen annonse? Prøv med en av disse</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {biler.map((b) => (
            <button
              key={b.id}
              onClick={() => onVelg(b)}
              className="flex flex-col gap-2 rounded-2xl bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
            >
              <BilBilde farge={b.farge} />
              <span className="font-semibold">{b.navn}</span>
              <span className="text-sm text-zinc-600">
                {b.ar} · {b.km.toLocaleString("nb-NO")} km
              </span>
              <span className="text-sm font-medium">{kroner(b.pris)}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function Resultat({ bil, onTilbake }: { bil: Bil; onTilbake: () => void }) {
  const stil = vurderingStil[bil.vurdering];
  const [radgiver, setRadgiver] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <button onClick={onTilbake} className="self-start text-sm font-medium text-zinc-600 hover:text-black">
        ← Sjekk en annen bil
      </button>

      <section className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="w-28 shrink-0 sm:w-36">
          <BilBilde farge={bil.farge} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold sm:text-2xl">
            {bil.navn} {bil.ar}
          </h1>
          <span className="text-sm text-zinc-600">{bil.variant}</span>
          <span className="text-sm text-zinc-600">
            {bil.km.toLocaleString("nb-NO")} km · {bil.sted}
          </span>
          <span className="mt-1 text-lg font-semibold">{kroner(bil.pris)}</span>
        </div>
      </section>

      <section className={`flex gap-4 rounded-2xl border-2 p-5 ${stil.boks}`}>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xl font-bold">
          {stil.ikon}
        </span>
        <div>
          <p className="text-sm font-medium uppercase tracking-wide opacity-80">Vår vurdering</p>
          <h2 className="text-2xl font-bold">{stil.tekst}</h2>
          <p className="mt-1">{bil.oppsummering}</p>
        </div>
      </section>

      <Kort tittel="Prisen sammenlignet med lignende biler">
        <PrisSkala bil={bil} />
      </Kort>

      <Kort tittel="Hva annonsen betyr">
        <ul className="flex flex-col divide-y divide-zinc-100">
          {bil.punkter.map((p) => (
            <li key={p.tittel} className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <span className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${statusStil[p.status].prikk}`} />
              <div className="flex flex-col gap-0.5">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-semibold">{p.tittel}</span>
                  <span className="text-zinc-600">{p.verdi}</span>
                </div>
                <p className="text-sm text-zinc-700">{p.forklaring}</p>
              </div>
            </li>
          ))}
        </ul>
      </Kort>

      <Kort tittel={`Kjente svakheter ved ${bil.navn}`} undertittel="Fra NAFs bruktbiltester">
        <ul className="flex list-disc flex-col gap-2 pl-5 text-zinc-800">
          {bil.svakheter.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Kort>

      <Kort tittel="Spør selgeren om dette">
        <ul className="flex flex-col gap-2">
          {bil.sporsmal.map((s) => (
            <li key={s} className="flex gap-2 text-zinc-800">
              <span className="font-bold">?</span>
              {s}
            </li>
          ))}
        </ul>
      </Kort>

      <section className="flex flex-col gap-3 rounded-2xl bg-gul p-5">
        <h2 className="text-xl font-bold">Usikker? Snakk med en NAF-rådgiver</h2>
        <p>
          En rådgiver kan se på annonsen sammen med deg, og hjelpe deg å vurdere om du bør gå videre
          med bilen.
        </p>
        <button
          onClick={() => setRadgiver(true)}
          className="self-start rounded-xl bg-foreground px-5 py-3 font-semibold text-white transition-transform active:scale-[0.98]"
        >
          Få hjelp av en rådgiver
        </button>
      </section>

      {radgiver && <RadgiverVindu onLukk={() => setRadgiver(false)} />}
    </div>
  );
}

function Kort({ tittel, undertittel, children }: { tittel: string; undertittel?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-bold">{tittel}</h2>
        {undertittel && <p className="text-sm text-zinc-500">{undertittel}</p>}
      </div>
      {children}
    </section>
  );
}

function PrisSkala({ bil }: { bil: Bil }) {
  const min = Math.min(bil.prisLav, bil.pris) * 0.9;
  const maks = Math.max(bil.prisHoy, bil.pris) * 1.05;
  const plass = (belop: number) => ((belop - min) / (maks - min)) * 100;
  const forskjell = bil.pris - bil.prisSnitt;

  let tekst: string;
  if (Math.abs(forskjell) < bil.prisSnitt * 0.05) {
    tekst = `Prisen er omtrent som snittet for lignende biler (${kroner(bil.prisSnitt)}).`;
  } else if (forskjell < 0) {
    tekst = `Prisen er ${kroner(-forskjell)} lavere enn snittet for lignende biler.`;
  } else {
    tekst = `Prisen er ${kroner(forskjell)} høyere enn snittet for lignende biler.`;
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-medium">{tekst}</p>
      <div className="relative pb-8 pt-10">
        <div className="h-3 rounded-full bg-zinc-100" />
        <div
          className="absolute top-10 h-3 rounded-full bg-zinc-300"
          style={{ left: `${plass(bil.prisLav)}%`, width: `${plass(bil.prisHoy) - plass(bil.prisLav)}%` }}
        />
        <div
          className="absolute top-9 h-5 w-0.5 bg-zinc-500"
          style={{ left: `${plass(bil.prisSnitt)}%` }}
        />
        <span
          className="absolute top-14 -translate-x-1/2 whitespace-nowrap text-xs text-zinc-500"
          style={{ left: `${plass(bil.prisSnitt)}%` }}
        >
          Snitt
        </span>
        <div
          className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
          style={{ left: `${plass(bil.pris)}%` }}
        >
          <span className="whitespace-nowrap rounded-md bg-foreground px-2 py-0.5 text-xs font-semibold text-white">
            Denne bilen
          </span>
          <span className="h-5 w-0.5 bg-foreground" />
        </div>
      </div>
      <p className="text-sm text-zinc-600">
        Det grå feltet viser hva {bil.antallSammenlignet} lignende biler (samme modell, årgang og
        kilometerstand) vanligvis selges for: {kroner(bil.prisLav)} til {kroner(bil.prisHoy)}.
      </p>
    </div>
  );
}

function RadgiverVindu({ onLukk }: { onLukk: () => void }) {
  const [valgt, setValgt] = useState<string | null>(null);
  const valg = [
    { id: "chat", tittel: "Chat nå", tekst: "Skriv med en rådgiver med en gang." },
    { id: "ring", tittel: "Bli ringt opp", tekst: "En rådgiver ringer deg innen en time." },
    { id: "test", tittel: "Bestill bruktbiltest", tekst: "En NAF-tekniker sjekker bilen før du kjøper." },
  ];

  return (
    <div className="fixed inset-0 z-10 flex items-end justify-center bg-black/40 p-4 sm:items-center" onClick={onLukk}>
      <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
        {valgt ? (
          <>
            <h2 className="text-xl font-bold">Takk!</h2>
            <p className="text-zinc-700">
              I den ekte tjenesten ville du nå fått kontakt med en rådgiver. Dette er en prototype, så
              ingenting er sendt.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold">Hvordan vil du ha hjelp?</h2>
            <div className="flex flex-col gap-2">
              {valg.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setValgt(v.id)}
                  className="flex flex-col rounded-xl border border-zinc-200 p-4 text-left hover:border-zinc-900"
                >
                  <span className="font-semibold">{v.tittel}</span>
                  <span className="text-sm text-zinc-600">{v.tekst}</span>
                </button>
              ))}
            </div>
          </>
        )}
        <button onClick={onLukk} className="self-end text-sm font-medium text-zinc-600 hover:text-black">
          Lukk
        </button>
      </div>
    </div>
  );
}

function BilBilde({ farge }: { farge: string }) {
  return (
    <svg viewBox="0 0 160 80" className="w-full rounded-xl bg-zinc-100" aria-hidden>
      <path
        d="M20 55 L28 38 Q34 28 48 27 L100 26 Q114 26 124 36 L134 44 Q146 46 146 55 L146 60 L20 60 Z"
        fill={farge}
        stroke="#1c1b19"
        strokeWidth="1.5"
      />
      <path d="M52 32 L98 31 Q108 31 116 40 L46 41 Z" fill="#dfe7ee" stroke="#1c1b19" strokeWidth="1" />
      <circle cx="48" cy="60" r="10" fill="#1c1b19" />
      <circle cx="48" cy="60" r="4" fill="#9a9a9a" />
      <circle cx="118" cy="60" r="10" fill="#1c1b19" />
      <circle cx="118" cy="60" r="4" fill="#9a9a9a" />
    </svg>
  );
}
