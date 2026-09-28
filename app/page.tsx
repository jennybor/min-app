"use client";

import { useEffect, useRef, useState } from "react";
import { biler, bilFraLenke, kroner, type Bil, type Status, type Vurdering } from "@/lib/biler";
import { loggKlikk } from "@/lib/klikk";
import Chat from "./Chat";

const vurderingStil: Record<Vurdering, { tekst: string; ikon: string; boks: string; ikonBg: string }> = {
  godt: { tekst: "Godt kjøp", ikon: "✓", boks: "border-emerald-600 text-emerald-800", ikonBg: "bg-emerald-600" },
  sjekk: { tekst: "Greit, men sjekk dette", ikon: "!", boks: "border-amber-500 text-amber-800", ikonBg: "bg-amber-500" },
  forsiktig: { tekst: "Vær forsiktig", ikon: "✕", boks: "border-rose-600 text-rose-800", ikonBg: "bg-rose-600" },
};

const statusStil: Record<Status, { prikk: string; etikett: string }> = {
  bra: { prikk: "bg-emerald-500", etikett: "Bra" },
  obs: { prikk: "bg-amber-400", etikett: "Verdt å sjekke" },
  darlig: { prikk: "bg-rose-500", etikett: "Obs" },
};

export default function Home() {
  const [bil, setBil] = useState<Bil | null>(null);

  useEffect(() => {
    loggKlikk("besok", { skjerm: window.innerWidth < 768 ? "mobil" : "stor" });
  }, []);

  function velgBil(ny: Bil, via: "eksempel" | "lenke") {
    loggKlikk("viste_resultat", { bil: ny.id, via });
    setBil(ny);
    window.scrollTo({ top: 0 });
  }

  function tilStart(hvordan: string) {
    if (bil) loggKlikk("tilbake_til_start", { bil: bil.id, hvordan });
    setBil(null);
  }

  return (
    <div className="flex flex-1 flex-col">
      <Topp onHjem={() => tilStart("logo")} />
      <main className="flex-1">
        {bil ? (
          <Resultat bil={bil} onTilbake={() => tilStart("tilbakeknapp")} />
        ) : (
          <Start onVelg={velgBil} />
        )}
      </main>
      <footer className="bg-black px-4 py-6 text-center text-xs text-zinc-400">
        Konseptprototype laget for brukertesting. Ikke en ekte NAF-tjeneste. Alle biler, priser og
        råd er eksempeldata.
      </footer>
    </div>
  );
}

function Topp({ onHjem }: { onHjem: () => void }) {
  return (
    <header className="bg-black text-white">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <button onClick={onHjem} className="text-left text-lg font-black tracking-tight">
          NAF <span className="text-gul">Kjøpsråd</span>
        </button>
        <span className="rounded-full border border-white/40 px-3 py-1 text-xs font-medium">Prototype</span>
      </div>
    </header>
  );
}

function Start({ onVelg }: { onVelg: (bil: Bil, via: "eksempel" | "lenke") => void }) {
  const [lenke, setLenke] = useState("");
  const [feil, setFeil] = useState("");

  function sjekk(e: React.FormEvent) {
    e.preventDefault();
    const renset = lenke.trim();
    if (!renset) {
      loggKlikk("ugyldig_lenke", { grunn: "tom" });
      setFeil("Lim inn lenken til annonsen først.");
      return;
    }
    if (!renset.includes("finn.no")) {
      loggKlikk("ugyldig_lenke", { grunn: "ikke_finn" });
      setFeil("Det ser ikke ut som en lenke fra Finn. Den skal starte med finn.no eller https://www.finn.no.");
      return;
    }
    setFeil("");
    onVelg(bilFraLenke(renset), "lenke");
  }

  return (
    <div className="flex flex-col">
      <section className="bg-gul">
        <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10 sm:py-14">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">
              Er bruktbilen et godt kjøp?
            </h1>
            <p className="text-lg">
              Lim inn lenken til annonsen på Finn. Vi forklarer hva annonsen betyr, sammenligner med
              lignende biler, og sier rett ut hva du bør passe på.
            </p>
          </div>

          <form onSubmit={sjekk} className="flex flex-col gap-3">
            <label htmlFor="lenke" className="font-bold">
              Lenke til annonsen
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="lenke"
                type="text"
                inputMode="url"
                value={lenke}
                onChange={(e) => setLenke(e.target.value)}
                placeholder="https://www.finn.no/mobility/item/..."
                className="flex-1 rounded-lg border-2 border-black bg-white px-4 py-3 text-base outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-black px-6 py-3 text-base font-bold text-white transition-transform active:scale-[0.98]"
              >
                Sjekk bilen
              </button>
            </div>
            {feil && <p className="rounded-md bg-white px-3 py-2 text-sm font-medium text-rose-700">{feil}</p>}
          </form>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-10">
        <h2 className="text-xl font-black">Har du ingen annonse? Prøv med en av disse</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {biler.map((b) => (
            <button
              key={b.id}
              onClick={() => onVelg(b, "eksempel")}
              className="flex flex-col gap-2 rounded-lg border-2 border-transparent bg-white p-4 text-left transition-colors hover:border-black"
            >
              <BilBilde farge={b.farge} />
              <span className="font-bold">{b.navn}</span>
              <span className="text-sm text-zinc-600">
                {b.ar} · {b.km.toLocaleString("nb-NO")} km
              </span>
              <span className="font-bold">{kroner(b.pris)}</span>
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
  const bunn = useRef<HTMLElement>(null);

  // Logger når brukeren har scrollet helt ned til rådgiverboksen.
  useEffect(() => {
    const element = bunn.current;
    if (!element) return;
    const observator = new IntersectionObserver(([oppforing]) => {
      if (oppforing.isIntersecting) {
        loggKlikk("scrollet_til_bunnen", { bil: bil.id });
        observator.disconnect();
      }
    });
    observator.observe(element);
    return () => observator.disconnect();
  }, [bil.id]);

  return (
    <div className="flex flex-col">
      <section className="bg-gul">
        <div className="mx-auto flex max-w-2xl flex-col gap-5 px-4 pb-8 pt-5">
          <button onClick={onTilbake} className="self-start text-sm font-bold underline-offset-4 hover:underline">
            ← Sjekk en annen bil
          </button>
          <div className="flex items-center gap-4">
            <div className="w-28 shrink-0 sm:w-40">
              <BilBilde farge={bil.farge} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                {bil.navn} {bil.ar}
              </h1>
              <span className="text-sm">{bil.variant}</span>
              <span className="text-sm">
                {bil.km.toLocaleString("nb-NO")} km · {bil.sted}
              </span>
              <span className="mt-1 text-xl font-black">{kroner(bil.pris)}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6">
      <section className={`-mt-10 flex gap-4 rounded-lg border-l-8 bg-white p-5 shadow-md ${stil.boks}`}>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl font-black text-white ${stil.ikonBg}`}>
          {stil.ikon}
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest">Vår vurdering</p>
          <h2 className="text-3xl font-black tracking-tight">{stil.tekst}</h2>
          <p className="mt-1 text-black">{bil.oppsummering}</p>
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

      <section ref={bunn} className="flex flex-col gap-3 rounded-lg bg-black p-6 text-white">
        <h2 className="text-2xl font-black tracking-tight">
          Usikker? Snakk med en <span className="text-gul">NAF-rådgiver</span>
        </h2>
        <p className="text-zinc-300">
          En rådgiver kan se på annonsen sammen med deg, og hjelpe deg å vurdere om du bør gå videre
          med bilen.
        </p>
        <button
          onClick={() => {
            loggKlikk("trykket_radgiver", { bil: bil.id });
            setRadgiver(true);
          }}
          className="self-start rounded-lg bg-gul px-6 py-3 font-bold text-black transition-transform active:scale-[0.98]"
        >
          Få hjelp av en rådgiver
        </button>
      </section>

      {radgiver && <RadgiverVindu bil={bil} onLukk={() => setRadgiver(false)} />}
      </div>
    </div>
  );
}

function Kort({ tittel, undertittel, children }: { tittel: string; undertittel?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-lg bg-white p-5">
      <div>
        <h2 className="text-xl font-black tracking-tight">{tittel}</h2>
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

function RadgiverVindu({ bil, onLukk: lukk }: { bil: Bil; onLukk: () => void }) {
  const bilId = bil.id;
  const [valgt, setValgt] = useState<string | null>(null);

  function velg(id: string) {
    loggKlikk("valgte_hjelp", { bil: bilId, valg: id });
    setValgt(id);
  }

  function onLukk() {
    loggKlikk("lukket_radgiver", { bil: bilId, hadde_valgt: valgt ?? "ingenting" });
    lukk();
  }
  const valg = [
    { id: "chat", tittel: "Chat nå", tekst: "Få svar fra vår KI-rådgiver med en gang." },
    { id: "ring", tittel: "Bli ringt opp", tekst: "En rådgiver ringer deg innen en time." },
    { id: "test", tittel: "Bestill bruktbiltest", tekst: "En NAF-tekniker sjekker bilen før du kjøper." },
  ];

  return (
    <div className="fixed inset-0 z-10 flex items-end justify-center bg-black/40 p-4 sm:items-center" onClick={onLukk}>
      <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
        {valgt === "chat" ? (
          <Chat bil={bil} />
        ) : valgt ? (
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
                  onClick={() => velg(v.id)}
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
